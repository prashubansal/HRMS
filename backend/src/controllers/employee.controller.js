import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Employee} from "../models/employee.model.js"
import { EmployeeAttendance } from '../models/employeeAttendance.model.js'
import { EmployeeLeave } from '../models/employeeLeaves.model.js'
import { LeaveType } from '../models/leaveTypes.model.js'
import mongoose from 'mongoose'

const options = {
    httpOnly: true,     // prevents access from client-side javascript
    sameSite: "lax",    // Change this from "none" to "lax" for development
    secure: false,      // This is fine for development
};

const generateAccessAndRefreshTokens = async(userId) => {

    try {
        const employee = await Employee.findById(userId)
        const accessToken = employee.generateAccessToken()
        const refreshToken = employee.generateRefreshToken()
    
        employee.refreshToken = refreshToken
        await employee.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerEmployee = asyncHandler(async (req, res) => {
    //1. get employee details from frontend
    //2. validation - fields are not empty, correct format of data
    //3. check if employee already exists: email
    //4. create employee object - create entry in mongoDB
    //5. remove password and refershToken fields from response
    //6. check for employee creation
    //7. return response
    
    //1. get employee details from frontend
    const {designation, email, fullname, password} = req.body
    // console.log("email : ", email );
  
    // validation, if fields are empty
    if(
        [fullname, designation, email, password].some((field) => field?.trim() === "")
        
    ){
        throw new ApiError(400, "All fields are required")
    }

    //3. check if employee already exists: email
    const existedEmployee = await Employee.findOne({email})

    if(existedEmployee){
        throw new ApiError(409, "Employee with email id already exists")
    }
    
    //4. create employee object - create entry in mongoDB
    const employee = await Employee.create({
        fullname,
        designation,
        email,
        password
    })

    //5. remove password and refershToken fields from response
    //6. check for employee creation
    const createdEmployee = await Employee.findById(employee._id).select(
        "-password -refreshToken"
    )

    if(!createdEmployee){
        throw new ApiError(500, "Something went wrong while registering the employee")
    }

    //7. return response
    return res
    .status(201)
    .json(
        new ApiResponse(200, createdEmployee, "Employee registered successfully")
    )

})

const loginEmployee = asyncHandler(async (req, res) => {
    //req.body -> data
    //check if that employee exists in our db
    //validate the password 
    //generate the access and refresh token
    //return access and refresh token to frontend
    //save the refresh and access token in employee's browser through cookies using cookieParser

    const {email, password} = req.body
    
    if(!email){
        throw new ApiError(400, "email is required")
    }    

    const employee = await Employee.findOne({email})

    if(!employee){
        throw new ApiError(404, "employee does not exist")
    }

    const isPasswordValid = await employee.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Your password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(employee._id)

    const loggedInEmployee = await Employee.findById(employee._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                employee: loggedInEmployee,
                accessToken,
                refreshToken
            },
            "employee logged in successfully"
        )
    )
})

const forgotPassword = asyncHandler(async (req, res) => {
    // send verification otp through email

    const {email} = req.body

    if(!email){
        throw new ApiError(401, "Unauthorized request")
    }

    const employee = await Employee.findOne({email}).select("-password")

    if(!employee){
        throw new ApiError(404, "This user does not exist")
    } 

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "employee exists in the db")
    )
})

const resetPassword = asyncHandler(async (req, res) => {
    const {newPassword, email} = req.body
    console.log(req.body);

    if(!(newPassword && email)){
        throw new ApiError(401, "New Password is required")
    }

    const employee = await Employee.findOne({email})
    employee.password = newPassword
    await employee.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))
})

const logoutEmployee = asyncHandler(async (req, res) => {
    // clear the refreshToken field in the db
    // clear the cookies from the employee's browser
    
    await Employee.findByIdAndUpdate(
        req.employee?._id,
        { $unset: { refreshToken: "" } },
        {new: true}
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .clearCookie("timeIn", options)
    .json(
        new ApiResponse(200, {}, "Employee logged out")
    )
    
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
    
        const employee = await Employee.findById(decodedToken?._id)
    
        if(!employee){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingToken !== employee?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or usred")
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(employee._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse (
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token changed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body

    if(!(oldPassword || newPassword)){
        throw new ApiError(401, "both fields are required")
    }

    const employee = await Employee.findById(req.employee?._id)
    const isPasswordValid = await employee.isPasswordCorrect(oldPassword)

    console.log(isPasswordValid);
    if(!isPasswordValid){
        throw new ApiError(400, "invalid old password")
    }

    employee.password = newPassword
    await employee.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentEmployee = asyncHandler(async (req, res) => {
    try {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.employee,
                "employee details fetched successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request")
    }
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {designation, fullname, email} = req.body
    // console.log(req.body);
    

    if(!(designation || fullname || email)){
        throw new ApiError(401, "Please provide the details for atleast one field")
    }

    const employee = await Employee.findByIdAndUpdate(
        req.employee?._id,
        {
            $set: {fullname, designation, email}
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200, employee, "Account details updated")
    )    
})

const clockInTime = asyncHandler(async (req, res) => {
    // debugger;
    // get the data from frontend
    // check if there exists a employee with that email 
    // if document exists with the given email -> push the date and timeIn values in that doc
    // not exist => create the document with the given email and then push the date and timein values 
    // return the response

    const {timeIn, date} = req.body
    const employeeId = req.employee?._id

    if(!(timeIn && date && employeeId)){
        throw new ApiError(401, "not getting clockIn, date or employee Id")
    }

    // console.log(employeeId);
    
    const existingEmployee = await EmployeeAttendance.findOne({employeeId})

    if(!existingEmployee){
        const newEmployee = await EmployeeAttendance.create({
            employeeId,
            employeeAttendanceDetails: [
                {
                    date,
                    timeIn,
                    status: "Present" 
                }
            ]
        })
        // console.log('New employee has been created in the db :', newEmployee);

    }else {

        const existingDate = await EmployeeAttendance.findOne({employeeId, "employeeAttendanceDetails.date": date})
        // console.log(existingDate);
    
        if (existingDate){
            throw new ApiError(401, "Your Time in data has already registered with us")
        } 
        else {
            existingEmployee.employeeAttendanceDetails.push({
                date,
                timeIn,
                status: "Present",
            })
            
            await existingEmployee.save()
        }
    }

    return res
    .status(200)
    .cookie("timeIn", timeIn, options)
    .json(new ApiResponse(200, {}, "ClockIn and date enterd successfully"))

})

const saveAttendanceDetails = asyncHandler(async (req, res) => {
    const {timeIn, timeOut, attendanceDate, assignment} = req.body.formValues
    let dateId = req.body.dateId

    if(dateId){
        dateId = new mongoose.Types.ObjectId(dateId)
    }

    const employeeId = req.employee?._id

    // Calculating totalWorkDuration
    const timeInString = `${attendanceDate}T${timeIn}`
    const timeOutString = `${attendanceDate}T${timeOut}`

    // create a date object
    const dateTimeIn = new Date(timeInString)
    const dateTimeOut = new Date(timeOutString)

    const timeInMS = dateTimeIn.getTime()
    const timeOutMS = dateTimeOut.getTime()

    const totalHours = (timeOutMS - timeInMS)/1000/60/60
    const hours = String(Math.floor(totalHours)).padStart(2, 0) 
    const minutes = String(Math.floor((totalHours - Math.floor(totalHours))*60)).padStart(2, 0)
    
    const totalWorkDuration = hours + ":" +  minutes
    // console.log("totalWorkDuration: ", totalWorkDuration);
    


    // save the attendance record
    // find the employee first using employeeId
    // find the date object using the unique dateId
    // if found a date document with that dateId 
        // check if date is same or not => if not then throw error
        // if date is same => then update the other details
    // if not found a date document with that dateId
        // create a new document for that date under that employeeId

    const existingEmployee = await EmployeeAttendance.findOne({employeeId})

    if(existingEmployee){

        // const existingDateId = await EmployeeAttendance.findOne({employeeId, 'employeeAttendanceDetails._id': dateId})

        // find the particular date document using objectId of that date from Employee attendance model
        if(mongoose.Types.ObjectId.isValid(dateId)){
            const existingDate = await EmployeeAttendance.findOne(
                { 
                  employeeId,
                  "employeeAttendanceDetails": {
                    $elemMatch: {
                      "_id": dateId
                    }
                  }
                },
                {
                  "employeeAttendanceDetails.$": 1
                }
              );

                
            if(existingDate.employeeAttendanceDetails[0].date === attendanceDate){
                // console.log("existingDateId: ", existingDateId );
    
                await EmployeeAttendance.findOneAndUpdate(
                    {
                        "_id": existingDate._id,
                        "employeeAttendanceDetails._id": existingDate.employeeAttendanceDetails[0]._id
                    },
                    {
                        $set: {
                            "employeeAttendanceDetails.$.timeIn": timeIn,
                            "employeeAttendanceDetails.$.timeOut": timeOut,
                            "employeeAttendanceDetails.$.assignment": assignment,
                            "employeeAttendanceDetails.$.totalWorkDuration": totalWorkDuration
                        }
                    }
                )
    
            } else {
                throw new ApiError(404, "You cannot change date while updating the existing attendance detail")
            }
        } else {
                console.log("test2");
                
                existingEmployee.employeeAttendanceDetails.push({
                    date: attendanceDate,
                    timeIn,
                    timeOut,
                    totalWorkDuration,
                    status: "present",
                    assignment,
                })
    
                await existingEmployee.save()
        }

    } else {
        const newEmployee = await EmployeeAttendance.create({
            employeeId,
            employeeAttendanceDetails: [
                {
                    date: attendanceDate,
                    timeIn,
                    timeOut,
                    totalWorkDuration,
                    status: "present",
                    assignment,
                }
            ]
        })

        console.log("New document for employee: ", newEmployee);
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "attendance saved success"))
    
})

const clockOutTime = asyncHandler(async (req, res) => {
    const {timeOut, date} = req.body
    const employeeId = req.employee?._id
    // console.log(employeeId);
    // console.log(date);
    
    // find the attendance details of a particular date form an array of objects 
    const existingAttendanceDetails = await EmployeeAttendance.aggregate([
        {
            $match: {
                "employeeId": employeeId, //Match the employeeEmail
                "employeeAttendanceDetails.date": date // Match the specific date in the array
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id field
                employeeId: 1, // Include employeeId
                employeeAttendanceDetails: {
                    $filter: {
                        input: "$employeeAttendanceDetails", //Array to filter
                        as: "detail", //Alias for each item
                        cond: { $eq: ["$$detail.date", date] } //Condition to match date
                    }
                }
            }
        }
    ])

    console.log("UpdatedAttendance:", existingAttendanceDetails);

    const timeIn = req.cookies?.timeIn || existingAttendanceDetails[0].employeeAttendanceDetails[0].timeIn
    // console.log(timeIn);
    

    if(!(timeOut && employeeId && date && timeIn)){
        throw new ApiError(401, "clockIN time, clockOut time, date, or employeeId is missing")
    }

    // Calculating totalWorkDuration
    const timeInString = `${date}T${timeIn}`
    const timeOutString = `${date}T${timeOut}`

    // create a date object
    const dateTimeIn = new Date(timeInString)
    const dateTimeOut = new Date(timeOutString)

    const timeInMS = dateTimeIn.getTime()
    const timeOutMS = dateTimeOut.getTime()

    const totalHours = (timeOutMS - timeInMS)/1000/60/60
    const hours = String(Math.floor(totalHours)).padStart(2, 0) 
    const minutes = String(Math.floor((totalHours - Math.floor(totalHours))*60)).padStart(2, 0)
    
    const totalWorkDuration = hours + ":" +  minutes

    // updating the timeOut and totalWorkDuration in the DB
    if(!existingAttendanceDetails){
        throw new ApiError(401, "Did not find the employee or first press timeIn button")
    }

    // console.log(existingAttendanceDetails[0].employeeAttendanceDetails[0]);

    const detailsToUpdate = existingAttendanceDetails[0].employeeAttendanceDetails[0]
    // console.log("old document:", detailsToUpdate);

    if(detailsToUpdate.timeOut === "00:00" && detailsToUpdate.totalWorkDuration === "00:00"){
        await EmployeeAttendance.findOneAndUpdate(
            {
                employeeId,
                "employeeAttendanceDetails.date": date
            },
            {
                $set: {
                    "employeeAttendanceDetails.$.timeOut": timeOut,
                    "employeeAttendanceDetails.$.totalWorkDuration": totalWorkDuration
                }
            },
            {new: true}
        )

        // console.log("Updated document: ", updatedResult);
        
    }
    else{
        throw new ApiError(401, "Your Time Out data has already registered with us")
    }

    return res
    .status(200)
    .clearCookie("timeIn", timeIn, options)
    .json(new ApiResponse(200, {}, "Employee Time out registered successfully in the db"))

})

const getEmployeeAttendanceDetails = asyncHandler(async (req, res) => {
    const employeeId = req.employee?._id
    const {firstDay, lastDay} = req.body

    const employee = await EmployeeAttendance.findOne(
        { employeeId: employeeId }, // Match the employee by employeeId
        {
            employeeAttendanceDetails: {
            $filter: {
                input: "$employeeAttendanceDetails", // The array to filter
                as: "detail", // Alias for each element in the array
                cond: {
                $and: [
                    { $gte: ["$$detail.date", firstDay] }, // Date is greater than or equal to startDate
                    { $lte: ["$$detail.date", lastDay] } // Date is less than or equal to endDate
                ]
                }
            }
            },
            _id: 0
        }
    )

    if(!employee){
        throw new ApiError(401, "employee does not exists in employeeAttendance DB")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, employee, "got the employee attendance data"))
})

const saveEmployeeLeaveData = asyncHandler(async (req, res) => {
    // get the data from frontend
    // check if employee leave data document already exists
    // if yes => insert the new leave data into employeeLeaveDetails array
    // if not create the new document for that employee 

    const employeeId = req.employee?._id
    const {startDate, endDate, leaveDuration, leaveType, planningType, leaveReason} = req.body.formValues
    let leaveId = req.body.leaveId

    if(leaveId){
        leaveId = new mongoose.Types.ObjectId(leaveId)
    }

    // console.log(req.body);
    // console.log(employeeId);

    if(!(employeeId && startDate && endDate && leaveDuration && leaveType && planningType && leaveReason)){
        throw new ApiError(401, "All the fields are required")
    }

    const fromDate = new Date(startDate)
    const toDate = new Date(endDate)
    let currentDate = fromDate
    
    let days = 0
    while(currentDate <= toDate){
        let currentDay = currentDate.getDay()
        if(currentDay !== 6 && currentDay !== 0){
            days++
        } 
        currentDate.setDate(currentDate.getDate() + 1)
        currentDate = new Date(currentDate)
    }
    // console.log("No. of days: ", days);
    
    const employeeLeaveData = await EmployeeLeave.findOne({employeeId})

    if(employeeLeaveData){

        if(mongoose.Types.ObjectId.isValid(leaveId)){
            
            const existingId = await EmployeeLeave.findOne(
                {
                    employeeId,
                    "employeeLeaveDetails":{
                        $elemMatch: {
                            "_id": leaveId
                        }
                    }
                },
                {
                    "employeeLeaveDetails.$": 1
                }
            )

            console.log("existingId: ", existingId);

            if(existingId){
                EmployeeLeave.findOneAndUpdate(
                    {
                        "_id": existingId._id,
                        "employeeLeaveDetails._id": existingId.employeeLeaveDetails[0]._id
                    },
                    {
                        $set: {
                            "employeeLeaveDetails.$.startDate": startDate,
                            "employeeLeaveDetails.$.endDate": endDate,
                            "employeeLeaveDetails.$.days": days,
                            "employeeLeaveDetails.$.planningType": planningType,
                            "employeeLeaveDetails.$.leaveType": leaveType,
                            "employeeLeaveDetails.$.leaveDuration": leaveDuration,
                            "employeeLeaveDetails.$.leaveReason": leaveReason
                        }
                    }
                )
            }
            
        } else {employeeLeaveData.employeeLeaveDetails.push(
            {
                startDate,
                endDate,
                days,
                planningType,
                leaveType,
                leaveDuration,
                leaveReason,
            }
        )
        const leaveData = await employeeLeaveData.save()
        // console.log("If result: ", leaveData);
        }} else {
        const leaveData = await EmployeeLeave.create(
            {
                employeeId,
                employeeLeaveDetails: [
                    {
                        startDate,
                        endDate,
                        days,
                        planningType,
                        leaveType,
                        leaveDuration,
                        leaveReason,
                    }
                ]
            }
        )
        // console.log("else Result: ", leaveData);
    }

    return res
    .status(200)
    .json( new ApiResponse( 200, {}, "leave application registered successfully"))
})

const getLeaveRecord = asyncHandler(async (req, res) => {
    const employeeId = req.employee?._id
    const {leaveStatus} = req.body

    if(!employeeId){
        throw new ApiError(401, "unauthorized request")
    }

    const leaveRecord = await EmployeeLeave.aggregate([
        { $unwind: '$employeeLeaveDetails' },
        {   $match : {'employeeLeaveDetails.leaveStatus': leaveStatus } },
        { $project: {_id: 0, 'employeeLeaveDetails': 1} }
    ])

    return res
    .status(200)
    .json( new ApiResponse(200, leaveRecord, "Leave record fetched successfully") )
}) 

const getAllEmployeesAttendanceDetails = asyncHandler(async (req, res) => {
    const {date} = req.body
    // console.log(date);
    

    const employeesAttendanceRecord = await EmployeeAttendance.aggregate([
        {
            $unwind: '$employeeAttendanceDetails', // Flatten the attendance details array
        },
        {
            $match: {
                'employeeAttendanceDetails.date': date, // Filter by date
            },
        },
        {
            $lookup: {
                from: 'employees', // Collection name for employee
                localField: 'employeeId',
                foreignField: '_id',
                as: 'employeeDetails', // Field to store joined data
            },
        },
        {
            $unwind: '$employeeDetails', // Flatten employee details
        },
        {
            $project: {
                _id: 0,
                'employeeDetails.fullname': 1,
                'employeeDetails.designation': 1,
                'employeeAttendanceDetails': 1,
            },
        },
    ])

    if(!employeesAttendanceRecord){
        throw new ApiError(401, "Something went wrong while fetching the attendance record")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, employeesAttendanceRecord, "Attendance record fetched successfully"))
})

const getAllEmployeeInfo = asyncHandler( async (req, res) => {
    const {designation} = req.body

    if(!designation){
        const data = await Employee.find()

        if(!data){
            throw new ApiError(401, "Something went wrong while fetching data from db")
        }

        return res
        .status(200)
        .json(new ApiResponse(200, data, "All employees info fetched successfully"))
    } else {
        const data = await Employee.find({designation})

        if(!data){
            throw new ApiError(401, "Something went wrong while fetching data from db")
        }

        return res
        .status(200)
        .json(new ApiResponse(200, data, "fetched data according to designation"))
    }

    
})

const saveLeaveTypes = asyncHandler(async (req, res) => {
    const Leaves = req.body
    console.log(Leaves);
    
    const document = await LeaveType.countDocuments()

    if(document === 0){
        for (const key in Leaves) {
            await LeaveType.create({name: Leaves[key]})
        }
    } else {
        for (const key in Leaves) {
            const leaveRecordExists = await LeaveType.findOne({name: Leaves[key]})
            if(!leaveRecordExists){
                LeaveType.create({name: Leaves[key]})
            } else {
                console.log(leaveRecordExists);
                console.log(`${Leaves[key]} type already exists`);
            }
        }
    }

    

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "leave types inserted in db"))
})

const getLeaveTypes = asyncHandler(async (req, res) => {
    const response = await LeaveType.find()

    if(!response){
        throw new ApiError(401, "no data found in the DB")
    }
    
    return res
    .status(200)
    .json( new ApiResponse(200, response, "fetch leaveTypes success"))
})

const getAllEmployeeLeaveDetails = asyncHandler(async (req, res) => {
    const {fullname, leaveStatus} = req.body
    
    if(!fullname){
        const employeesLeaveRecord = await EmployeeLeave.aggregate([
            {
                $unwind: '$employeeLeaveDetails', //Flatten the Leave Details array
            },
            {
                $match: {
                    'employeeLeaveDetails.leaveStatus': leaveStatus, // Filter by Status
                }
            },
            {
                $lookup: {
                    from: 'employees', // collection name for employee
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employeeDetails' // Field to store joined data
                }
            },
            {
                $unwind: '$employeeDetails' // Flatten employee details
            },
            {
                $project : {
                    _id: 0,
                    'employeeDetails.fullname': 1,
                    'employeeLeaveDetails': 1
                },
            },
        ])

        if(!employeesLeaveRecord){
            throw new ApiError(501, "something went wrong while fetching data from the db")
        }
        // console.log(employeesLeaveRecord);
        

        return res
        .status(200)
        .json(new ApiResponse(200, employeesLeaveRecord, "fetched leave data successfully"))

    } else {
        const employee = await Employee.findOne({fullname}) 
        const {_id} = employee
        console.log("employee id: ", _id);
        
        const employeesLeaveRecord = await EmployeeLeave.aggregate([
            {
                $unwind: '$employeeLeaveDetails', // flatten the leave detials array
            },
            {
                $match: {
                    'employeeId': _id,
                    'employeeLeaveDetails.leaveStatus': leaveStatus,
                },
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employeeDetails',
                },
            },
            {
                $unwind: '$employeeDetails',
            },
            {
                $project: {
                    _id: 0,
                    'employeeDetails.fullname': 1,  
                    'employeeLeaveDetails': 1
                },
            },
        ])
        // console.log("employeesLeaveRecord: ", employeesLeaveRecord);
        

        return res
        .status(200)
        .json(new ApiResponse(200, employeesLeaveRecord, "fetched data success"))
    }
})

const changeLeaveStatus = asyncHandler(async (req, res) => {
    const {leaveStatus, fullname, startDate, } = req.body

    const {_id} = await Employee.findOne({fullname})

    const updatedData = await EmployeeLeave.updateOne(
        {
            employeeId: _id,
            'employeeLeaveDetails.startDate': startDate
        },
        {
            $set: {
                'employeeLeaveDetails.$.leaveStatus': leaveStatus // Need to specify the full path with positional operator
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "leave status changed successfully"))
})

const cancelLeave = asyncHandler(async (req, res) => {
    let {leaveId } = req.body
    const employeeId = req.employee?._id
    leaveId = new mongoose.Types.ObjectId(leaveId)

    const updatedData = await EmployeeLeave.updateOne(
        {
            employeeId,
            'employeeLeaveDetails._id': leaveId
        },
        {
            $set: {
                'employeeLeaveDetails.$.leaveStatus': "Cancelled" // Need to specify the full path with positional operator
            }
        },
        {new: true}
    )
    // console.log("updated data: ", updatedData);
    

    return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "leave cancelled successfully"))
})


export {
    registerEmployee,
    loginEmployee,
    forgotPassword,
    resetPassword,
    logoutEmployee,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentEmployee,
    updateAccountDetails,
    clockInTime,
    saveAttendanceDetails,
    clockOutTime,
    getEmployeeAttendanceDetails,
    saveEmployeeLeaveData,
    getLeaveRecord,
    getAllEmployeesAttendanceDetails,
    getAllEmployeeInfo,
    saveLeaveTypes,
    getLeaveTypes,
    getAllEmployeeLeaveDetails,
    changeLeaveStatus,
    cancelLeave,
}
