import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    
    //access accessToken and refreshToken from req.cookies
    //decode it
    //find the employee from db using decoded token
    //add the employee object in req
    try {
        const token = req.cookies?.accessToken
        if(!token){
            throw new ApiError(404, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const employee = await Employee.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!employee){
            throw new ApiError(401, "Invalid access token")
        }
    
        req.employee = employee
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

