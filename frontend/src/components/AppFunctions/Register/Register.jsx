import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Register() {
  const navigate = useNavigate()
  const [employeeDetails, setEmployeeDetails] = useState({
    fullname:'',
    email:'',
    designation:'',
    phoneNo:'',
    password:'',
    confirmPassword:''
  })

  const [errors, setErrors] = useState({
    email: false,
    password: false
  })  

  const validateEmail = (email) => {
    let regx = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/

    if(!regx.test(email)){
      setErrors({
        ...errors,
        email: true
      })
    } else{
      setErrors({
        ...errors,
        email: false
      })
    }
}

  const matchPassword = () => {
    
      if(employeeDetails.password !== employeeDetails.confirmPassword){
        setErrors({
          ...errors,
          password: true
        })
      }
    }

  const registerFormHandler = async (e) => {
    e.preventDefault()
    matchPassword()
    console.log(e.target);
    const formData = new FormData(e.target)
    const formValues = Object.fromEntries(formData)

    try {
      const response = await axios.post('/api/v1/employees/register', formValues, {withCredentials: true})

      console.log('Register Response:', response)
      alert('User Registered successfully')
      navigate('/')
    } catch (error) {
      console.log('Register Failed:', error);
    }
  }

  
  const handleInputChange = (e) => {
    const {name, value} = e.target
    // console.log("name: ", name);
    // console.log("value: ", value);
    
    setEmployeeDetails({
      ...employeeDetails,
      [name]: value
    })

    if(name === "email"){
      validateEmail(value)
    }
  }
  
    

  return (
    <div className='flex justify-center items-center'>
      <div className='bg-white flex flex-col w-1/4 gap-y-4 py-3 px-4 rounded-lg shadow-xl h-full'>
        <h1 className='text-3xl font-semibold'>Create Account</h1>
        <form 
        onSubmit={registerFormHandler}
        className='flex flex-col gap-y-3'
        id='formData'
        >
          {/* fullname */}
          <label 
          className='text-sm text-[#000000bf] -mb-3 font-semibold'
          htmlFor="fullname">
            Enter your full name
          </label>
          <input
          className='border border-black py-1 px-3 rounded-md' 
          type="text" 
          name='fullname' 
          id='fullname' 
          value={employeeDetails.fullname}
          onChange={handleInputChange}
          required
          />
          
          {/* email */}
          <label 
          className='text-sm text-[#000000bf] -mb-3 font-semibold' 
          htmlFor="email">
            Email
          </label>
          <input 
          className='border border-black py-1 px-3 rounded-md'
          type="email" 
          name="email" 
          id="email" 
          value={employeeDetails.email}
          onChange={handleInputChange}
          />
          {errors.email && (
            <label 
            className='text-red-500 -mt-4'
            htmlFor="email" 
            id='emailLabel'>
              Please enter a valid email address
            </label>
          )}

          {/* designation */}
          <label 
          className='text-sm text-[#000000bf] -mb-3 font-semibold'
          htmlFor="designation">
            Designation
          </label>
          <input
          className='border border-black py-1 px-3 rounded-md' 
          type="text" 
          name='designation' 
          id='designation'
          value={employeeDetails.designation}
          onChange={handleInputChange} 
          required
          />

          {/* phoneNo */}
          <label 
          className='text-sm text-[#000000bf] -mb-3 font-semibold' 
          htmlFor="userMobileNo">
            Phone Number
          </label>
          <input 
          className='border border-black py-1 px-3 rounded-md'
          type="tel" 
          name="phoneNo" 
          id="phoneNo"
          value={employeeDetails.phoneNo}
          onChange={handleInputChange} 
          required
          />

          {/* password */}
          <label 
          className='text-sm text-[#000000bf] -mb-3 font-semibold' 
          htmlFor="password">
            Password (6+ character)
          </label>
          <input 
          className='border border-black py-1 px-3 rounded-md'
          type="password" 
          name="password" 
          id="password" 
          value={employeeDetails.password}
          onChange={handleInputChange}
          required
          />

          {/* confirm Password */}
          <label 
          className='text-sm text-[#000000bf] -mb-3 font-semibold' 
          htmlFor="confPassword">
            Confirm Password
          </label>
          <input 
          className='border border-black py-1 px-3 rounded-md'
          type="password" 
          name="confirmPassword" 
          id="confirmPassword" 
          value={employeeDetails.confirmPassword}
          onChange={handleInputChange}
          required
          />
          {errors.password && (
            <label 
              className='text-red-500 -mt-4'
              htmlFor="confPassword">
              Your password is not matching
            </label>
          )}

          {/* Register Button */}
          <div className='btn'>
            <button type='submit'>Register</button>
          </div>
        </form>

        <div className='text-center'>
          <span>Already a user?</span>
          <Link
          to='/'
          className='footerLink'
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Register