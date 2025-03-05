import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Sidebar() {
    const navigate = useNavigate()
    const [employeeDetails, setEmployeeDetails] = useState({})

    useEffect(() => {

        const employeeDetails = async () => {
            try {
                const response = await axios.get("/api/v1/employees/employeeDetails", {withCredentials: true})
                const FetchedEmployeeDetails = response.data.data
                const nameArray = FetchedEmployeeDetails.fullname.split(" ")
                FetchedEmployeeDetails.employeeInitials = ""

                for(let i=0; i<nameArray.length; i++){
                    FetchedEmployeeDetails.employeeInitials += nameArray[i].charAt(0)
                }

                setEmployeeDetails(FetchedEmployeeDetails)
                
            } catch (error) {
                console.log("employeeDetails Failed: ", error);
                
            }
        }

        employeeDetails()
    }, [])

    const logOut = async () => {
        // debugger;
        try {
            const response = await axios.post("/api/v1/employees/logout",
            {}, // request body
            {withCredentials: true} // Supports CORS, ensures that cookies or other credentials are included in the request to the server
        )
            // console.log('Logout Response:', response);
            navigate('/')

        } catch (error) {
            console.log('Logout failed:', error);
        }
    }

  return (
    
        <aside className="w-64 bg-white shadow-md h-screen p-4">

            {/* Employee Details Section */}
            <div className='mb-10 flex flex-col items-center gap-y-1 py-4'>
                <div 
                className='flex justify-center items-center border border-gray-300 rounded-full w-16 h-16 bg-gray-200'>{employeeDetails.employeeInitials}</div>
                <p className='text-black font-semibold'>{employeeDetails.fullname}</p>
                <p className='text-gray-700 font-medium'>{employeeDetails.designation}</p>
                <p className='text-gray-700 text-sm'>{employeeDetails.email}</p>
            </div>

            {/* Employee Features Section */}
            <ul className="space-y-4">
                <li><Link to="/employeeLayout/employee-dashboard" className="text-gray-700 font-medium hover:text-blue-500">Dashboard</Link></li>
                <li><Link to="/employeeLayout/profile" className="text-gray-700 font-medium hover:text-blue-500">Profile</Link></li>
                <li><Link href="#" className="text-gray-700 font-medium hover:text-blue-500">Compensation</Link></li>
                <li><Link href="#" className="text-gray-700 font-medium hover:text-blue-500">Benefits</Link></li>
                <li><Link to="/employeeLayout/leaveDetails" className="text-gray-700 font-medium hover:text-blue-500">Leave Details</Link></li>
                <li><Link to="/employeeLayout/attendanceDetails" className="text-gray-700 font-medium hover:text-blue-500">Attendance</Link></li>
                <li><button onClick={logOut} className="text-red-700 font-medium hover:text-blue-500">Logout</button></li>
            </ul>

        </aside>
  )
}

export default Sidebar