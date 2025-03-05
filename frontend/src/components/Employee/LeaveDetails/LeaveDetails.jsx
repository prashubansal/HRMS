import axios from 'axios'
import React, { useEffect, useState } from 'react'
                         
function LeaveDetails() {
                         
    const [leaveRecord, setLeaveRecord] = useState([])
    const [leaveType, setLeaveType] = useState([])
    const [isLeavePopupOpen, setIsLeavePopupOpen] = useState(false)
    const [leaveStatus, setLeaveStatus] = useState("Pending")
    const [leaveId, setLeaveId] = useState("")
    const [leaveDetails, setLeaveDetails] = useState({
        startDate:"",    
        endDate:"",      
        planningType:"", 
        leaveType:"",    
        leaveDuration:"",
        leaveReason:"",  
    })                   
                         
    useEffect(() => {    
        const getLeaveRecord = async (leaveStatus) => {
            // debugger  
            try {        
                const response = await axios.post("/api/v1/employees/leaveRecord", {leaveStatus}, {withCredentials: true})
                // console.log("getLeaveRecord: ", response);
                          
                setLeaveRecord(response.data.data)
                          
            } catch (error) {
                console.log("getLeaveRecord: ", error);
                          
            }              
        }                 
        getLeaveRecord(leaveStatus)
        getLeaveTypeDetails()
    }, [leaveStatus])    
 
    const getLeaveTypeDetails = async () => {
        try {
            const response = await axios.get("/api/v1/employees/getLeaveTypes", {withCredentials: true})
            const fetchedLeaveTypes = response.data.data
            // console.log("getLeaveTypeDetails Response: ", fetchedLeaveTypes);
            setLeaveType(fetchedLeaveTypes)
            
        } catch (error) {
            console.log("getLeaveTypeDetails Failed: ", error);
            
        }
    }

    const toggleLeavePopup = () => {
        setIsLeavePopupOpen(!isLeavePopupOpen)
        setLeaveId("")
    }

    const leaveFormHandler = async (e) => {
        // debugger
        e.preventDefault()
        toggleLeavePopup()
        setLeaveDetails({
            ...leaveDetails,
            startDate:"",
            endDate:"",
            planningType:"",
            leaveType:"",
            leaveDuration:"",
            leaveReason:"",
        })

        const formData = new FormData(e.target)
        const formValues = Object.fromEntries(formData)
        // console.log("Form values: ", formValues);



        try {
            const response = await axios.post("/api/v1/employees/applyForLeave", 
                {formValues, leaveId}, 
                {withCredentials: true}
            )

            console.log("leaveFormHandler response: ", response);

        } catch (error) {
            console.log("leaveFormHandler Failed: ", error);
        }
    }

    const cancelLeave = async () => {
        debugger
        toggleLeavePopup()
        
        const payload = {
            leaveId,
        }

        try {
            const response = await axios.post('/api/v1/employees/cancelLeave', payload, {withCredentials: true})   
            console.log('cancelLeave Response: ', response);
            
        } catch (error) {
            console.log("cancelLeave Failed: ", error);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setLeaveDetails({
            ...leaveDetails,
            [name]: value
        })
    }

    const editLeaveDetails = (startDate, endDate, planningType, leaveType, leaveDuration, leaveReason, leaveId) => {
        toggleLeavePopup()

        setLeaveDetails({
            ...leaveDetails,
            startDate,
            endDate,
            planningType,
            leaveType,
            leaveDuration,
            leaveReason
        })
        setLeaveId(leaveId)
    }

  return (
    <div className="flex-1 p-6">

        {/* Dashboard top section */}
        <div className='flex justify-between mb-6'>
            <h3 className="text-xl font-semibold mb-4">Leave Details for <span id="selected-month">2024</span></h3>

            {/* Apply for leave button and leave filter*/}
            <div className='flex gap-x-2'>

                {/* apply for leave btn */}
                <div className='flex justify-between'>
                        <button 
                        id='leaveButton'
                        onClick={toggleLeavePopup}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Apply for Leave
                        </button>

                        {/* Leave form popup*/}
                        {isLeavePopupOpen && (
                            <form 
                            id='leaveForm'
                            onSubmit={leaveFormHandler}
                            className="fixed bg-white left-[40%] top-[15%] p-6 rounded-lg shadow-md max-w-md z-[1000]">
                                <h2 className="text-2xl font-semibold mb-4">Apply for leave</h2>
                                
                                {/* Date Filter */}
                                <div className="mb-4">
                                    <div className='flex justify-between'>
                                        <label htmlFor="startDate" className='text-sm font-medium text-gray-700'>From :</label>
                                        <input 
                                        className="-ml-8 w-1/3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                                        type="date" 
                                        id="startDate" 
                                        name="startDate" 
                                        value={leaveDetails.startDate}
                                        onChange={handleInputChange}
                                        required
                                        />

                                        <label htmlFor="endDate" className='text-sm font-medium text-gray-700'>To :</label>
                                        <input 
                                        className=" -ml-8 w-1/3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                                        type="date" 
                                        id="endDate" 
                                        name="endDate" 
                                        value={leaveDetails.endDate}
                                        onChange={handleInputChange}
                                        required
                                        />
                                    </div>
                                </div>

                                {/* Planned and Unplanned Checkbox */}
                                <div className="mb-4">
                                    <span className="block text-sm font-medium text-gray-700">Planning type</span>
                                    <div className="flex items-center gap-4 mt-1">
                                        <label className="flex items-center">
                                            <input 
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                                            type="radio" 
                                            name="planningType" 
                                            value="Planned"
                                            checked={leaveDetails.planningType === "Planned"}
                                            onChange={handleInputChange}
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Planned</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                            type="radio" 
                                            name="planningType" 
                                            value="Unplanned" 
                                            checked={leaveDetails.planningType === "Unplanned"}
                                            onChange={handleInputChange}
                                            required
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Unplanned</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Leave Type Dropdown */}
                                <div className="mb-4">
                                    <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">Leave Type</label>
                                        <select 
                                        name="leaveType"
                                        value={leaveDetails.leaveType}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select leave type</option>
                                            {leaveType.map((detail, index) => (
                                                <option key={index} value={detail.name}>{detail.name}</option>
                                            ))}
                                        </select>
                                </div>

                                {/* Full Day Checkbox and Half Day Dropdown */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-4 mt-1">
                                        <label className="flex items-center">
                                            <input 
                                            type="radio" 
                                            name="leaveDuration" 
                                            value="Half Day" 
                                            checked={leaveDetails.leaveDuration === "Half Day"}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Half day</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                            type="radio" 
                                            name="leaveDuration" 
                                            value="Full Day" 
                                            checked={leaveDetails.leaveDuration === "Full Day"}
                                            onChange={handleInputChange}
                                            required
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Full day</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Reason for leave box */}
                                <div className="mb-4">
                                    <label htmlFor="leaveReason" className="block text-sm font-medium text-gray-700">Reason for leave</label>
                                    <textarea 
                                    id='leaveReason'
                                    name='leaveReason'
                                    rows="3"
                                    cols="50"
                                    maxLength="200"
                                    value={leaveDetails.leaveReason}
                                    onChange={handleInputChange}
                                    required
                                    className='mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                    />
                                </div>

                                {/* Submit and close Button */}
                                <div className='flex space-x-2'>
                                    <button 
                                    type="submit" 
                                    className="w-2/5 bg-green-500 text-white py-2 px-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                    >
                                        Submit
                                    </button>

                                    <button
                                    onClick={() => {
                                        toggleLeavePopup()
                                        setLeaveDetails({
                                            ...leaveDetails,
                                            startDate:"",
                                            endDate:"",
                                            planningType:"",
                                            leaveType:"",
                                            leaveDuration:"",
                                            leaveReason:"",
                                        })
                                    }} 
                                    type='button' 
                                    className="w-2/5 bg-red-500 text-white py-2 px-2 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                                        Close
                                    </button>

                                    <button 
                                    onClick={cancelLeave}
                                    type="button" 
                                    className="w-2/5 bg-orange-500 text-white py-2 px-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* overlay for the background */}
                        {isLeavePopupOpen && (
                            <div
                            onClick={() => {
                                toggleLeavePopup()
                                setLeaveDetails({
                                    ...leaveDetails,
                                    startDate:"",
                                    endDate:"",
                                    planningType:"",
                                    leaveType:"",
                                    leaveDuration:"",
                                    leaveReason:"",
                                })
                            }}
                            className='fixed top-0 left-0 w-full h-full bg-[#00000080] z-[999]'
                            ></div>
                        )}

                </div>

                {/* leave filter */}
                <select 
                    onChange={(e) => setLeaveStatus(e.target.value)}
                    className='border border-black rounded-lg'
                    name="leaveStatus" 
                    id="leaveStatus">
                        <option value="">Select leave Type</option>
                        <option value="Pending" className='bg-yellow-400'>Pending</option>
                        <option value="Approved" className='bg-green-600'>Approved</option>
                        <option value="Rejected" className='bg-red-600'>Rejected</option>
                        <option value="Cancelled" className='bg-purple-600'>Cancelled</option>
                </select>
            </div>
        </div>

        {/* dashboard */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">

            {/* Employee Leave Record overview */}
            <table className="table-auto w-full text-center border border-gray-200">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="p-2 border border-gray-200">From</th>
                        <th className="p-2 border border-gray-200">To</th>
                        <th className="p-2 border border-gray-200">Planning Type</th>
                        <th className="p-2 border border-gray-200">Leave Type</th>
                        <th className="p-2 border border-gray-200">Leave Duration</th>
                        <th className="p-2 border border-gray-200">Reason</th>
                        <th className="p-2 border border-gray-200">Status</th>
                    </tr>
                </thead>
                <tbody> 
                    {leaveRecord.map((record, index)=>(
                        <tr key={index}>
                            <td className="p-2 border border-gray-200">{record.employeeLeaveDetails.startDate}</td>
                            <td className="p-2 border border-gray-200">{record.employeeLeaveDetails.endDate}</td>
                            <td className="p-2 border border-gray-200">{record.employeeLeaveDetails.planningType}</td>
                            <td className="p-2 border border-gray-200">{record.employeeLeaveDetails.leaveType}</td>
                            <td className="p-2 border border-gray-200">{record.employeeLeaveDetails.leaveDuration}</td>
                            <td className="p-2 border border-gray-200">{record.employeeLeaveDetails.leaveReason}</td>
                            <td className="p-2 border border-gray-200">
                                {record.employeeLeaveDetails.leaveStatus === "Pending" && (
                                    <span className="bg-yellow-400 text-white px-2 py-1 rounded">{record.employeeLeaveDetails.leaveStatus}</span>
                                )}
                                {record.employeeLeaveDetails.leaveStatus === "Approved" && (
                                    <span className="bg-green-600 text-white px-2 py-1 rounded">{record.employeeLeaveDetails.leaveStatus}</span>
                                )}
                                {record.employeeLeaveDetails.leaveStatus === "Rejected" && (
                                    <span className="bg-red-600 text-white px-2 py-1 rounded">{record.employeeLeaveDetails.leaveStatus}</span>
                                )}
                                {record.employeeLeaveDetails.leaveStatus === "Cancelled" && (
                                    <span className="bg-purple-600 text-white px-2 py-1 rounded">{record.employeeLeaveDetails.leaveStatus}</span>
                                )}
                            </td>
                        
                            {record.employeeLeaveDetails.leaveStatus === "Pending" && (
                            <td 
                            onClick={() => {
                                editLeaveDetails(
                                record.employeeLeaveDetails.startDate,
                                record.employeeLeaveDetails.endDate,
                                record.employeeLeaveDetails.planningType,
                                record.employeeLeaveDetails.leaveType,
                                record.employeeLeaveDetails.leaveDuration,
                                record.employeeLeaveDetails.leaveReason,
                                record.employeeLeaveDetails._id
                            )}}
                            className="border border-gray-200">
                                <i className="fa-regular fa-pen-to-square"></i>
                            </td>
                            )}
                        </tr> 
                    ))} 
                </tbody>
            </table>    
        </div>          
    </div>               
  )
}

export default LeaveDetails