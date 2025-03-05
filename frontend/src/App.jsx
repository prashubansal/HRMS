import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './App.css'
import {AdminDashboard, AttendanceDetails, EmployeeDashboard, EmployeeManagement, ForgotPassword, LeaveDetails, LeaveManagement, LogIn, Profile, Register, ResetPassword } from './components/index.js'
import EmployeeLayout from './employeeLayout'
import AdminLayout from './AdminLayout'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='' element={<LogIn />} />
      <Route path='/register-user' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />

      <Route path='/employeeLayout' element={<EmployeeLayout />}>
        <Route path='/employeeLayout/employee-dashboard' element={<EmployeeDashboard />} />
        <Route path='/employeeLayout/profile' element={<Profile />} />
        <Route path='/employeeLayout/leaveDetails' element={<LeaveDetails />} />
        <Route path='/employeeLayout/attendanceDetails' element={<AttendanceDetails />} />
      </Route>

      <Route path='/adminLayout' element={<AdminLayout />}>
        <Route path='/adminLayout/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/adminLayout/employeeManagement' element={<EmployeeManagement />} />
        <Route path='/adminLayout/leaveManagement' element={<LeaveManagement />} />
      </Route>
    </>
    )
  )

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
