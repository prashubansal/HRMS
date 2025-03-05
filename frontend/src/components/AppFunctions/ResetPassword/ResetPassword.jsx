import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ResetPassword() {
  const navigate = useNavigate()
  
  const [error, setError] = useState(false)
  const [passwordDetails, setPasswordDetails] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const openLoginPage = async () => {

      if(passwordDetails.newPassword !== passwordDetails.confirmPassword){
        setMatchPassword(true)
      }

      try {
          const payload = {
              "newPassword":passwordDetails.newPassword,
              "email":localStorage.getItem("userEmail")
          }
          const response = await axios.post('http://localhost:5000/api/v1/employees/resetPassword', payload)
          
          console.log('ResetPassword Response:', response);
          alert('Password changed successfully')
          navigate('/')
      } catch (error) {
          console.log('ResetPassword Failed:', error);
      }
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target

    setPasswordDetails({
      ...passwordDetails,
      [name]: value
    })
  }

  return (
    <div className='flex justify-center items-center mt-10'>
      <div className='bg-white w-1/4 flex flex-col gap-y-6 py-4 px-4 rounded-lg shadow-xl'>
        <h1 className='text-3xl font-semibold'>Create a new password</h1>
        <div 
        className='flex flex-col gap-y-6'>

          <input 
          className='border border-black p-1 rounded-md text-lg text-black'
          type="password" 
          name="newPassword" 
          id="newPassword"
          placeholder='New Password'
          value={passwordDetails.newPassword}
          onChange={handleInputChange} 
          required
          />

          <input 
          className='border border-black p-1 rounded-md text-lg text-black'
          type="password" 
          name='confirmPassword'
          id='confirmPassword'
          placeholder='Confirm password' 
          value={passwordDetails.confirmPassword}
          onChange={handleInputChange}
          required/>

          {error && 
          (<label 
          htmlFor="confirmPassword"
          id='passwordLabel'
          className='hidden -mt-4'
          >
            passwords are not matching
          </label>)}

          <div className='btn'>
            <button type='submit' onClick={openLoginPage}>Submit</button>
          </div>
        </div>
      </div>
      
    </div>
)
}

export default ResetPassword