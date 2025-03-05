import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Profile() {

    const [employeeDetails, setEmployeeDetails] = useState({
        fullname: '',
        email: '',
        designation: '',
        phoneNo: ''
    })

    useEffect(() => {

        const employeeDetails = async () => {
            try {
                const response = await axios.get("/api/v1/employees/employeeDetails", {withCredentials: true})
                const FetchedEmployeeDetails = response.data.data
                setEmployeeDetails(FetchedEmployeeDetails)
                
            } catch (error) {
                console.log("employeeDetails Failed: ", error);
                
            }
        }

        employeeDetails()
    }, [])

    const profileFormHandler = async (e) => {
        e.preventDefault()
        
        const formData = new FormData(e.target)
        const formValues = Object.fromEntries(formData)
        // console.log("Form values: ", formValues);

        try {
            const response = await axios.post("/api/v1/employees/updateAccountDetails", 
                formValues,
                {withCredentials: true}
            )
            // console.log("profileFormHandler: ", response);
            
        } catch (error) {
            console.log("profileFormHandler: ", error);
            
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setEmployeeDetails({
            ...employeeDetails,
            [name]: value
        })
    }

  return (

    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Employee Profile</h3>
  
        {/* Profile Details  */}
        <form 
        onSubmit={profileFormHandler}
        className="space-y-6">
            
            <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                type="text"
                name='fullname'
                className="mt-1 p-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={employeeDetails.fullname}
                onChange={handleInputChange}
                />
            </div>
    
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                type="email"
                name='email'
                className="mt-1 p-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={employeeDetails.email}
                onChange={handleInputChange}
                />
            </div>
    
            <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                type="text"
                name='designation'
                className="mt-1 p-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={employeeDetails.designation}
                onChange={handleInputChange}
                />
            </div>
    
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                type="text"
                name='phoneNo'
                className="mt-1 p-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={employeeDetails.phoneNo}
                onChange={handleInputChange}
                />
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="reset"
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 focus:outline-none"
                >
                    <Link
                    to="/employee-dashboard">
                    Cancel
                    </Link>
                    
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
                >
                    Save Changes
                </button>
            </div>
  
        </form>

      </div>
    </div>

  )
}

export default Profile