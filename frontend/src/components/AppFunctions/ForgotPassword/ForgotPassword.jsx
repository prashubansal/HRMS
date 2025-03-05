import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const [email, setEmail] = useState('')

    const validateEmail = (email) => {

        let regx = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
        if(regx.test(email)){
          setError(false)
        }
        else {
          setError(true)
        }}

    const verfiyUser = async () => {
        try {
            const payload = {
                "email":email
            }
    
            const response = await axios.post('http://localhost:5000/api/v1/employees/forgotPassword', payload)

            console.log('ForgotPassword Response:', response);
            localStorage.setItem("userEmail", email);
            navigate('/reset-password')
        } catch (error) {
            console.log('ForgotPassword Failed:', error);
        }

    }

  return (
    <div className='flex justify-center items-center mt-10'>
      <div className='bg-white w-1/4 flex flex-col gap-y-6 py-4 px-4 rounded-lg shadow-xl'>
        <h1 className='text-3xl font-semibold'>Forgot password</h1>
        <div 
        className='flex flex-col gap-y-6'>

            <p className='font-sans text-sm '>Enter your email address, and we'll send you a link to get back into your account.</p>

            <input 
                className='border border-black p-1 rounded-md text-lg text-black'
                type="email" 
                name="email" 
                id="email"
                placeholder='Email' 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  validateEmail(e.target.value)
                }}
                required
                />

            {error && 
            (<label 
                className='hidden -mt-4'
                htmlFor="email" 
                id='emailLabel'>
                    Please enter a valid email address
            </label>)}

            <div className='btn'>
            <button onClick={verfiyUser}>Verify User</button>
            </div>
        </div>
      </div>
      
    </div>
  )
}

export default ForgotPassword