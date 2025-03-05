import React from 'react'
import { logo, profile32 } from '../../assets/Images'

function Header() {
  return (
    <div className='flex justify-between items-center bg-[#4A5568] py-3 px-5 mb-3'>
      {/* Logo Section */}
      <div className='flex items-center'>
        <img className='h-10' src={logo} alt="Company Logo" />
      </div>

      {/* Page Title Section */}
      <div className='text-lg font-bold text-center'>
        Dashboard
      </div>

      {/* Profile Section */}
      <div className='flex items-center gap-4'>
        <div className='cursor-pointer'><i className="fa-regular fa-bell fa-lg"></i></div>
        <img className='cursor-pointer' src={profile32} alt="User Profile" />
      </div>
    </div>
  )
}

export default Header