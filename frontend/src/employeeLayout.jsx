import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer, Header, Sidebar } from './components'


function EmployeeLayout() {
  return (
    <>
    <Header />
    <main className="flex">
    <Sidebar />
    <Outlet />
    </main>
    <Footer />
    </>
  )
}

export default EmployeeLayout