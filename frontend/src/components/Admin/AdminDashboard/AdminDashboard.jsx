import React, { useEffect, useState } from 'react'
import axios from "axios"

function AdminDashboard() {

  const [EmployeesAttendanceDetails, setEmployeesAttendanceDetails] = useState([])

  useEffect(() => {
    // debugger
    const today = new Date()
    const day = String(today.getDate()).padStart(2, 0)
    const month = String(today.toLocaleString('default', {month:'2-digit'}))
    const year = String(today.getFullYear())
    const date = `${year}-${month}-${day}`
    // console.log(date);
    
    // const getEmployeesAttendanceDetails = async () => {

    //   try {
    //    const response = await axios.post("/api/v1/employees/EmployeesAttendanceDetails", 
    //     {"date": date}, 
    //     {withCredentials: true}
    //   )
    //   const fetchCurrentAttendanceRecord = response.data.data
    //   // console.log("getEmployeesDetails Response: ", fetchCurrentAttendanceRecord);
    //   setEmployeesAttendanceDetails(fetchCurrentAttendanceRecord)

    //   } catch (error) {
    //     console.log("getEmployeesDetails Failed: ", error);
    //   }
    // }

    getEmployeesAttendanceDetails(date)
  }, [])

  const getEmployeesAttendanceDetails = async (date) => {

    try {
     const response = await axios.post("/api/v1/employees/employeesAttendanceDetails", 
      {"date": date}, 
      {withCredentials: true}
    )
    const fetchCurrentAttendanceRecord = response.data.data
    // console.log("getEmployeesDetails Response: ", fetchCurrentAttendanceRecord);
    setEmployeesAttendanceDetails(fetchCurrentAttendanceRecord)

    } catch (error) {
      console.log("getEmployeesDetails Failed: ", error);
    }
  }


  return (
    <div className="flex-1 p-6">
    {/* Dashboard Header  */}
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
    </div>

    {/* Statistics Cards  */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">50</h2>
        <p className="text-gray-600">Total Employees</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">45</h2>
        <p className="text-gray-600">Present Today</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">5</h2>
        <p className="text-gray-600">Absent Today</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">3</h2>
        <p className="text-gray-600">Leave Requests</p>
      </div>
    </div>

    {/* Attendance Table  */}
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className='flex justify-between'>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Attendance Overview</h2>
      <input
      onChange={(e) => {
        getEmployeesAttendanceDetails(e.target.value)
      }}
      className='border border-black mb-4'
      type="date" 
      name="dateFilter" 
      id="dateFilter"
       />
      </div>
      <table className="table-auto w-full text-center border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border border-gray-200">Employee Name</th>
            <th className="p-2 border border-gray-200">Designation</th>
            <th className="p-2 border border-gray-200">Time In</th>
            <th className="p-2 border border-gray-200">Time Out</th>
            <th className="p-2 border border-gray-200">Status</th>
            <th className="p-2 border border-gray-200">Assignment</th>
          </tr>
        </thead>
        <tbody>
          {EmployeesAttendanceDetails.map((detail, index) => (
          <tr key={index}>
            <td className="p-2 border border-gray-200">{detail.employeeDetails.fullname}</td>
            <td className="p-2 border border-gray-200">{detail.employeeDetails.designation}</td>
            <td className="p-2 border border-gray-200">{detail.employeeAttendanceDetails.timeIn}</td>
            <td className="p-2 border border-gray-200">{detail.employeeAttendanceDetails.timeOut}</td>
            <td className="p-2 border border-gray-200">
              <span className="bg-green-500 text-white px-2 py-1 rounded">{detail.employeeAttendanceDetails.status}</span>
            </td>
            <td className="p-2 border border-gray-200">{detail.employeeAttendanceDetails.assignment}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default AdminDashboard