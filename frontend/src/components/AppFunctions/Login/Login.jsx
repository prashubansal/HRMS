import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function LogIn() {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: ''
  })

  const validateLogin = async () => {
    try {
      const payload = {
        "email":loginDetails.email,
        "password":loginDetails.password
      }

      const response = await axios.post('/api/v1/employees/login', payload)
      const designation = response.data.data.employee.designation

      if (designation === "admin"){
        navigate('/adminLayout/admin-dashboard')
      } else {
        navigate('/employeeLayout/employee-dashboard')
      }
      console.log('Login Response:', response.data.data.employee.designation);
      alert('Employee logged in Successfully')

    } catch (error) {
      console.log('Login Failed:', error);
    }
  }

  const validateEmail = (email) => {
    
    let regx = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
    if(!regx.test(email)){
      setError(true)
    } else{
      setError(false)
    }}

  const handleInputChange = (e) => {
    const {name, value} = e.target

    setLoginDetails({
      ...loginDetails,
      [name]: value
    })

    if(name === "email"){
      validateEmail(value)
    }
  }

  return (
    <div className='flex justify-center items-center mt-10'>
      <div className='bg-white w-1/4 flex flex-col gap-y-6 py-4 px-4 rounded-lg shadow-xl'>
        <h1 className='text-3xl font-semibold'>Log in</h1>
        <div 
        className='flex flex-col gap-y-6'>

          <input 
          className='border border-black p-1 rounded-md text-lg text-black'
          type="email" 
          name="email" 
          id="email"
          placeholder='Email' 
          value={loginDetails.email}
          onChange={handleInputChange}
          required
          />

          {error && 
          (<label 
          className='text-red-500 -mt-4'
          htmlFor="email" 
          id='emailLabel'>
            Please enter a valid email address
          </label>)}

          <input 
          className='border border-black p-1 rounded-md text-lg text-black'
          type="password" 
          name='password'
          id='password'
          placeholder='Password' 
          value={loginDetails.password}
          onChange={handleInputChange}
          required/>

          <div className='btn'>
            <button type='submit' onClick={validateLogin}>Log In</button>
          </div>
        </div>

        <div className='text-center'>
          <span>Don't have an account?</span>
          <Link 
            to='/register-user' 
            className='footerLink'
          >
            Sign up
          </Link>
        </div>
        <div className='footerLink text-center'>
          <Link 
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      
    </div>
  )
}
export default LogIn