import React from 'react'
import { AdminSidebar, Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <>
    <Header />
    <main className="flex">
      <AdminSidebar />
      <Outlet />
    </main>
    <Footer />
    </>
  )
}

export default AdminLayout