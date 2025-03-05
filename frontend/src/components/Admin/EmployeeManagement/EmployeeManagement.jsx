import axios from 'axios'
import React, { useEffect, useState } from 'react'

function EmployeeManagement() {

    const [employeeDetails, setEmployeeDetails] = useState([])

    useEffect(() => {
        getAllEmployeeInfo("")
    }, [])

    const getAllEmployeeInfo = async (designation) => {

        const payload = {"designation": designation}

        try {
            const response = await axios.post('/api/v1/employees/allEmployeesInfo', 
                payload,
                {withCredentials: true}
            )
            const fetchedEmployeesInfo = response.data.data
            // console.log('getAllEmployeeInfo response: ', fetchedEmployeesInfo);
            setEmployeeDetails(fetchedEmployeesInfo)
            
        } catch (error) {
            console.log('getAllEmployeeInfo Failed: ', error);
        }
    }

  return (
    <div className="flex-1 p-6">
    {/* Dashboard Header  */}
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-gray-800">Employee Management Dashboard</h1>
    </div>

    {/* Employee table */}
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className='flex justify-between'>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Overview</h2>
        <select 
        onChange={(e) => {
            getAllEmployeeInfo(e.target.value)
        }}
        className='mb-4 border border-black'
        name="Designation" 
        id="designation">
            <option value="">Select Designation</option>
            <option value="sde1">sde1</option>
            <option value="sde2">sde2</option>
            <option value="sde3">sde3</option>
            <option value="tester">tester</option>
        </select>
      </div>
      <table className="table-auto w-full text-center border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border border-gray-200">Employee Name</th>
            <th className="p-2 border border-gray-200">Designation</th>
            <th className="p-2 border border-gray-200">Email</th>
            <th className="p-2 border border-gray-200">Contact No</th>
          </tr>
        </thead>
        <tbody>
          {employeeDetails.map((detail, index) => (
          <tr key={index}>
            <td className="p-2 border border-gray-200">{detail.fullname}</td>
            <td className="p-2 border border-gray-200">{detail.designation}</td>
            <td className="p-2 border border-gray-200">{detail.email}</td>
            <td className="p-2 border border-gray-200">{detail.contactNo}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default EmployeeManagement