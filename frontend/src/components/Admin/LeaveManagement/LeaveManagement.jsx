import React, { useEffect, useState } from 'react'
import axios from "axios"

function LeaveManagement() {

    let leaveCount = 1;
    const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([])
    const [employeeNames, setEmployeeNames] = useState([])
    const [leaveStatus, setLeaveStatus] = useState("Pending")
    const [employeeName, setEmployeeName] = useState("")

    

    useEffect(() => {
        getAllEmployeeName()
    }, [])


    useEffect(() => {
        getEmployeesLeaveRecord(employeeName, leaveStatus)
    }, [leaveStatus, employeeName])


    const getEmployeesLeaveRecord = async (employeeName, leaveStatus) => {
        // console.log("employee name: ", employeeName);
        // console.log("leave Status: ", leaveStatus);
        const payload = {
            "fullname": employeeName,
            "leaveStatus": leaveStatus
        }
        
        try {
            const response = await axios.post("/api/v1/employees/getEmployeesLeaveRecord", 
                payload, 
                {withCredentials: true}
            )
            const fetchedLeaveRecord = response.data.data
            // console.log("getEmployeesLeaveRecord Response: ", fetchedLeaveRecord);
            setEmployeeLeaveDetails(fetchedLeaveRecord)
            
        } catch (error) {
            console.log("getEmployeesLeaveRecord Failed: ", error);
        }

    }

    const getAllEmployeeName = async () => {
        try {
            const response = await axios.post("/api/v1/employees/allEmployeesInfo", {designation: ""}, {withCredentials: true})
            const fetchedEmployeeNames = response.data.data
            // console.log("getAllEmployeeName Response: ", response.data.data);
            setEmployeeNames(fetchedEmployeeNames)
            
        } catch (error) {
            console.log("getAllEmployeeName Error: ", error);
        }
    }

    const addLeavesBtn = () => {
        document.getElementById('addLeavesTypesForm').style.display = 'flex'
    }

    const addLeaveType = () => {
        leaveCount++;
        const leaveTypesContainer = document.getElementById('leave-types-container');

        const leaveTypeTemplate = `
            <div id="leave-type-${leaveCount}" class="space-y-4">
                <h3 class="text-md font-semibold">Leave Type ${leaveCount}</h3>
                <div>
                    <label htmlFor="leave-type-${leaveCount}" class="block text-sm font-medium text-gray-700">Leave Name</label>
                    <input 
                        type="text" 
                        id="leave-type-${leaveCount}" 
                        name="leave-type-${leaveCount}" 
                        class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                        placeholder="e.g., Sick Leave">
                </div>
            </div>
        `;

        leaveTypesContainer.insertAdjacentHTML('beforeend', leaveTypeTemplate);
    }

    const deleteLeaveType = () => {
        document.getElementById(`leave-type-${leaveCount}`).remove();
        leaveCount--
    }

    const addLeaveTypesFormHandler = async (e) => {
        debugger
        e.preventDefault()
        const formData = new FormData(e.target)
        const formValues = Object.fromEntries(formData)
        console.log("formValues: ", formValues);
        
        try {
            const response = await axios.post('/api/v1/employees/saveLeaveTypes',
                formValues,
                {withCredentials: true}
            )
            console.log("addLeaveTypesFormHandler Response: ", response);
            
        } catch (error) {
            console.log("addLeaveTypesFormHandler Failed: ", error);
            
        }
    }

    const changeLeaveStatus = async (leaveStatus, fullname, date) => {
        // debugger
        //send this new leaveStatus to the backend
        //update the leaveStatus value in the "employeeleaves" model for that employee
        const payload = {
            "leaveStatus": leaveStatus,
            "fullname": fullname,
            "date": date
        }
        try {
            const response = await axios.post('/api/v1/employees/changeLeaveStatus', 
                payload, 
                {withCredentials: true}
            )
            console.log("changeLeaveStatus Response: ", response);
            
        } catch (error) {
            console.log("changeLeaveStatus Failed: ", error);
        }
    }

    

  return (
    <div className="flex-1 p-6">
        {/* Dashboard Header  */}
        <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Leave Management Dashboard</h1>
        </div>

        {/* Dashboard */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            {/* Dashboard Top section */}  
            <div className='flex justify-between'>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Leaves Overview</h2>
                <div className='space-x-2 mb-4'>
                    <button
                    type='button'
                    onClick={addLeavesBtn}
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
                    >
                        Add Leaves
                    </button>
                    <select 
                    onChange={(e) => setLeaveStatus(e.target.value)}
                    className='border border-black'
                    name="leaveStatus" 
                    id="leaveStatus">
                        <option value="">Select leave Type</option>
                        <option value="Pending" className='bg-yellow-400'>Pending</option>
                        <option value="Approved" className='bg-green-600'>Approved</option>
                        <option value="Rejected" className='bg-red-600'>Rejected</option>
                        <option value="Cancelled" className='bg-purple-600'>Cancelled</option>
                    </select>
                    <select
                    onChange={(e) => setEmployeeName(e.target.value)} 
                    className='border border-black'
                    name="employeeName" 
                    id="employeeName">
                        <option value="">Employee Name</option>
                        {employeeNames.map((detail, index) => (
                            <option key={index} value={detail.fullname}>{detail.fullname}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Add Leave Form  */}
            <div id='addLeavesTypesForm' className="bg-gray-100 px-3 py-6 items-center justify-center mb-2 hidden">
                <form 
                onSubmit={addLeaveTypesFormHandler}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">Add Leave Types</h2>
                    <div id="leave-types-container" className="space-y-4">
                        {/* Default Leave Type  */}
                        <div id="leave-type-1" className="space-y-4">
                            <h3 className="text-md font-semibold">Leave Type 1</h3>

                            <div>
                                <label htmlFor="leave-type-1" className="block text-sm font-medium text-gray-700">Leave Name</label>
                                <input 
                                    type="text" 
                                    id="leave-type-1" 
                                    name="leave-type-1" 
                                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                                    placeholder="e.g., Annual Leave" />
                            </div>

                        </div>
                    </div>

                    {/* Add Leave Type Button  */}
                    <div className="flex justify-end my-4 space-x-2">
                        <button 
                            type="button" 
                            onClick={addLeaveType} 
                            className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
                            Add Leave
                        </button>

                        <button 
                            type="button" 
                            onClick={deleteLeaveType} 
                            className="bg-orange-500 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center">
                            Delete Leave
                        </button>
                    </div>

                    {/* Submit Button  and close button */}
                    <div className='flex justify-around'>
                        <button 
                        type="submit" 
                        className="w-2/5 bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        >
                            Submit
                        </button>

                        <button
                        onClick={() => {
                            document.getElementById('addLeavesTypesForm').style.display = 'none'
                        }} 
                        type='reset' 
                        className="w-2/5 bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                            Close
                        </button>
                    </div>
                </form>
            </div>

            {/* Employees leave table */}
            <table className="table-auto w-full text-center border border-gray-200">
                <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="p-2 border border-gray-200">Employee Name</th>
                    <th className="p-2 border border-gray-200">Date</th>
                    <th className="p-2 border border-gray-200">Planning Type</th>
                    <th className="p-2 border border-gray-200">Leave Type</th>
                    <th className="p-2 border border-gray-200">Leave Duration</th>
                    <th className="p-2 border border-gray-200">Leave Request</th>
                    {leaveStatus === "Pending" && (
                        <>
                            <th className="p-2 border border-gray-200">Approve Request</th>
                            <th className="p-2 border border-gray-200">Reject Request</th>
                        </>
                    )}
                </tr>
                </thead>
                <tbody>
                {employeeLeaveDetails.map((detail, index) => (
                <tr key={index} id={detail.employeeDetails.fullname}>
                    <td className="p-2 border border-gray-200 fullname">{detail.employeeDetails.fullname}</td>
                    <td className="p-2 border border-gray-200 date">{detail.employeeLeaveDetails.date}</td>
                    <td className="p-2 border border-gray-200 planningType">{detail.employeeLeaveDetails.planningType}</td>
                    <td className="p-2 border border-gray-200 leaveType">{detail.employeeLeaveDetails.leaveType}</td>
                    <td className="p-2 border border-gray-200 leaveDuration">{detail.employeeLeaveDetails.leaveDuration}</td>
                    <td className="p-2 border border-gray-200 leaveStatus">
                        {detail.employeeLeaveDetails.leaveStatus === "Pending" && (
                            <span className="bg-yellow-400 text-white px-2 py-1 rounded">{detail.employeeLeaveDetails.leaveStatus}</span>
                        )}
                        {detail.employeeLeaveDetails.leaveStatus === "Approved" && (
                            <span className="bg-green-600 text-white px-2 py-1 rounded">{detail.employeeLeaveDetails.leaveStatus}</span>
                        )}
                        {detail.employeeLeaveDetails.leaveStatus === "Rejected" && (
                            <span className="bg-red-600 text-white px-2 py-1 rounded">{detail.employeeLeaveDetails.leaveStatus}</span>
                        )}
                    </td>

                    {detail.employeeLeaveDetails.leaveStatus === "Pending" && (
                        <>
                            {/* Approve btn */}
                            <td 
                            className='p-2 border border-gray-200'
                            >
                                <span 
                                onClick={(e) => 
                                changeLeaveStatus(
                                    e.target.dataset.value, 
                                    detail.employeeDetails.fullname,
                                    detail.employeeLeaveDetails.date
                                )}
                                data-value="Approved"
                                className="bg-green-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-green-400"
                               >
                                    Approve
                                </span> 
                            </td>
                        
                            {/* Reject btn */}
                            <td 
                            className='p-2 border border-gray-200'
                            >
                                <span 
                                onClick={(e) => changeLeaveStatus(
                                    e.target.dataset.value,
                                    detail.employeeLeaveDetails.fullname,
                                    detail.employeeLeaveDetails.date
                                )}
                                data-value="Rejected"
                                className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-400"
                                >
                                    Reject
                                </span> 
                            </td>
                        </>
                    )}
                </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default LeaveManagement