import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { cancelLeave, changeCurrentPassword, changeLeaveStatus, forgotPassword, getAllEmployeeInfo, getAllEmployeeLeaveDetails, getAllEmployeesAttendanceDetails, getCurrentEmployee, getEmployeeAttendanceDetails, getLeaveRecord, getLeaveTypes, loginEmployee, logoutEmployee, registerEmployee, resetPassword, saveAttendanceDetails, saveEmployeeLeaveData, saveLeaveTypes, updateAccountDetails } from "../controllers/employee.controller.js";

const router = Router()

//as soon as request comes to this page and if it has "/register", redirect it to "user.controller.js"
debugger;
router.route("/register").post(registerEmployee)
router.route("/login").post(loginEmployee)
router.route("/forgotPassword").post(forgotPassword)
router.route("/resetPassword").post(resetPassword)  

//secured routes
router.route("/logout").post(verifyJWT, logoutEmployee)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route("/employeeDetails").get(verifyJWT, getCurrentEmployee)
router.route("/updateAccountDetails").post(verifyJWT, updateAccountDetails)
router.route("/saveAttendanceDetails").post(verifyJWT, saveAttendanceDetails)
// router.route("/employeeClockOut").post(verifyJWT, clockOutTime)
router.route("/attendanceDetails").post(verifyJWT, getEmployeeAttendanceDetails)
router.route("/applyForLeave").post(verifyJWT, saveEmployeeLeaveData)
router.route("/leaveRecord").post(verifyJWT, getLeaveRecord)
router.route("/employeesAttendanceDetails").post(getAllEmployeesAttendanceDetails)
router.route("/allEmployeesInfo").post(getAllEmployeeInfo)
router.route("/saveLeaveTypes").post(saveLeaveTypes)
router.route("/getLeaveTypes").get(getLeaveTypes)
router.route("/getEmployeesLeaveRecord").post(getAllEmployeeLeaveDetails)
router.route("/changeLeaveStatus").post(changeLeaveStatus)
router.route("/cancelLeave").post(verifyJWT, cancelLeave)

export default router