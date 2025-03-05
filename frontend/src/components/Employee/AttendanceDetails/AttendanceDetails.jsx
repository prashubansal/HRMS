import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function AttendanceDetails() {
    const [attendanceDetials, setAttendanceDetials] = useState([])
    const [isAttendancePopupOpen, setIsAttendancePopupOpen] = useState(false)
    const [attendanceDetails, setAttendanceDetails] = useState({
        attendanceDate:"",
        timeIn:"",
        timeOut:"",
        assignment:""
    })
    const [dateId, setDateId] = useState("")

    useEffect(() => {

        const today = new Date()
        const year = today.getFullYear()
        const month = today.toLocaleString('default', {month:'2-digit'})
        // const timeFilter = `${year}-${month}`

        const startDate = new Date(year, month-1, 1)
        const lastDate = new Date(year, month, 0)
        // console.log(startDate);
        // console.log(lastDate);

        const formatDate = (date) => {
            const yyyy = date.getFullYear()
            const mm =  (date.getMonth() + 1).toString().padStart(2, "0")
            const dd = date.getDate().toString().padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`
        }

        const firstDay = formatDate(startDate)
        const lastDay = formatDate(lastDate)
        // console.log(firstDay);
        // console.log(lastDay);
        
        fetchAttendanceDetails(firstDay, lastDay)
        
    }, [])

    const fetchAttendanceDetails = async (firstDay, lastDay) => {
        try {
            const payload = {
                "firstDay":firstDay,
                "lastDay":lastDay
            }

            const response = await axios.post('/api/v1/employees/attendanceDetails',
            payload, 
            {withCredentials: true})

            const FetchedAttendanceDetails = response.data.data.employeeAttendanceDetails
            setAttendanceDetials(FetchedAttendanceDetails)
            // console.log(FetchedAttendanceDetails);

        } catch (error) {
            console.log('fetchAttendanceDetails Failed: ', error);
        }
    }

    const toggleAttendancePopup = () => {
        setIsAttendancePopupOpen(!isAttendancePopupOpen)
        setDateId("")
    }

    const getAttendanceDetails = async (yyyymm) => {
        const filter = yyyymm.split("-")
        // console.log(filter);
        const year = filter[0]
        const month = filter[1]

        const startDate = new Date(year, month-1, 1)
        const lastDate = new Date(year, month, 0)
        // console.log(startDate);
        // console.log(lastDate);

        const formatDate = (date) => {
            const yyyy = date.getFullYear()
            const mm =  (date.getMonth() + 1).toString().padStart(2, "0")
            const dd = date.getDate().toString().padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`
        }

        const firstDay = formatDate(startDate)
        const lastDay = formatDate(lastDate)
        // console.log(firstDay);
        // console.log(lastDay);

        try {
            const payload = {
                "firstDay":firstDay,
                "lastDay":lastDay 
            }

            const response = await axios.post("/api/v1/employees/attendanceDetails",
                payload,
                {withCredentials: true}
            )

            const FetchedAttendanceDetails = response.data.data.employeeAttendanceDetails
            setAttendanceDetials(FetchedAttendanceDetails)
            // console.log(FetchedAttendanceDetails);

        } catch (error) {
            console.log('fetchAttendanceDetails Failed: ', error);
        }

    }

    const attendanceFormHandler = async (e) => {
        // debugger
        e.preventDefault()
        toggleAttendancePopup()

        const formData = new FormData(e.target)
        const formValues = Object.fromEntries(formData)
        console.log("form values: ", formValues);
        console.log("dateId: ", dateId);
        

        try {
            const response = await axios.post('/api/v1/employees/saveAttendanceDetails',
                {formValues, dateId},
                {withCredentials: true}
            )   
            console.log("attendanceFormHandler Response: ", response);
            setAttendanceDetails({
                ...attendanceDetails,
                attendanceDate:"",
                timeIn:"",
                timeOut:"",
                assignment:""
            })
            
        } catch (error) {
            console.log("attendanceFormHandler Failed: ", error);
        }
        
    }

    const editAttendance = (date, timeIn, timeOut, assignment, id) => {
        toggleAttendancePopup()

        setAttendanceDetails({
            ...attendanceDetails,
            attendanceDate: date,
            timeIn,
            timeOut,
            assignment
        })
        setDateId(id)
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setAttendanceDetails({
            ...attendanceDetails,
            [name]: value
        })
    }

  return (
        <div className="flex-1 p-6">
            {/* dashboard */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">

                <h3 className="text-xl font-semibold mb-4">Attendance for <span id="selected-month">2024-April</span></h3>

                {/* Attendance btn  and filter*/}
                <div className="flex justify-between mb-6">

                    <button
                    id='attendanceBtn'
                    onClick={toggleAttendancePopup}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Mark Attendance
                    </button>

                    {/* Attendance form popup */}
                    {isAttendancePopupOpen && (
                        <form
                        onSubmit={attendanceFormHandler}
                        className='fixed bg-white left-[43%] top-1/4 p-6 rounded-lg shadow-md z-[1000]'
                        >
                            <h2 className="text-xl font-semibold mb-6">Mark your attendance</h2>

                            {/* Date */}
                            <div className="mb-6">
                                <div className='flex gap-x-1'>
                                    <label htmlFor="attendanceDate" className='text-sm font-medium text-gray-700'>Date :</label>
                                    <input 
                                    className="rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                                    type="date" 
                                    id="attendanceDate" 
                                    name="attendanceDate"
                                    value={attendanceDetails.attendanceDate}
                                    onChange={handleInputChange}
                                    required
                                    />
                                </div>
                            </div>

                            {/* timeIn and timeOut*/}
                            <div className="mb-6">
                                <div className='flex gap-x-6'>
                                    <label htmlFor="timeIn" className='text-sm font-medium text-gray-700'>In :</label>
                                    <input 
                                    className="-ml-5 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                                    type="time" 
                                    id="timeIn" 
                                    name="timeIn" 
                                    value={attendanceDetails.timeIn}
                                    onChange={handleInputChange}
                                    required
                                    />

                                    <label htmlFor="timeOut" className='text-sm font-medium text-gray-700'>Out :</label>
                                    <input 
                                    className="-ml-5 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                                    type="time" 
                                    id="timeOut" 
                                    name="timeOut" 
                                    value={attendanceDetails.timeOut}
                                    onChange={handleInputChange}
                                    required
                                    />
                                </div>
                            </div>

                            <div className='mb-6'>
                            <label htmlFor="assignment" className="block text-sm font-medium text-gray-700">Today's Assignment</label>
                                <textarea
                                className="mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                id='assignment' 
                                name='assignment'
                                type="text" 
                                maxLength="100"
                                value={attendanceDetails.assignment}
                                onChange={handleInputChange}
                                required
                                />
                            </div>

                            {/* Submit and close Button */}
                            <div className='flex justify-around'>
                                <button 
                                type="submit" 
                                className="w-2/5 bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                >
                                    Submit
                                </button>

                                <button
                                onClick={() => {
                                    toggleAttendancePopup()
                                    setAttendanceDetails({
                                        ...attendanceDetails,
                                        attendanceDate:"",
                                        timeIn:"",
                                        timeOut:"",
                                        assignment:""
                                    })
                                }} 
                                type='button' 
                                className="w-2/5 bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                                    Close
                                </button>
                            </div>
                        </form>
                    )}

                    {/* overlay for the background */}
                    {isAttendancePopupOpen && (
                        <div
                        onClick={toggleAttendancePopup}
                        className='fixed top-0 left-0 w-full h-full bg-[#00000080] z-[999]'
                        ></div>
                    )}

                    {/* month calendar filter */}
                    <div className="flex items-center space-x-2">
                        <input 
                        onChange={(e) => {
                            // console.log(e.target.value);
                            getAttendanceDetails(e.target.value)
                        }}
                        className="p-2 border border-gray-300 rounded"
                        type="month" 
                        id="attendancecalendar" 
                        // value={selectedMonth}
                        placeholder="e.g., April" 
                        />
                    </div>

                </div>
                    
                {/* Employee Attendance Detailed overview */}
                <table className="table-auto w-full text-center border border-gray-200">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="p-2 border border-gray-200">Date</th>
                            <th className="p-2 border border-gray-200">Time In</th>
                            <th className="p-2 border border-gray-200">Time Out</th>
                            <th className="p-2 border border-gray-200">Total Hours</th>
                            <th className="p-2 border border-gray-200">Status</th>
                            <th className="p-2 border border-gray-200">Assignment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceDetials.map((detail, index)=>(
                           <tr key={index}>
                            <td className="p-2 border border-gray-200">{detail.date}</td>
                            <td className="p-2 border border-gray-200">{detail.timeIn}</td>
                            <td className="p-2 border border-gray-200">{detail.timeOut}</td>
                            <td className="p-2 border border-gray-200">{detail.totalWorkDuration}</td>
                            <td className="p-2 border border-gray-200">
                                <span className="bg-green-500 text-white px-2 py-1 rounded">{detail.status}</span>
                            </td>
                            <td className="p-2 border border-gray-200">{detail.assignment}</td>
                            <td 
                            onClick={() => {
                                editAttendance(
                                    detail.date,
                                    detail.timeIn,
                                    detail.timeOut,
                                    detail.assignment,
                                    detail._id
                                )
                            }}
                            className="border border-gray-200 cursor-pointer">
                                <i className="fa-regular fa-pen-to-square"></i>
                            </td>
                           </tr> 
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default AttendanceDetails