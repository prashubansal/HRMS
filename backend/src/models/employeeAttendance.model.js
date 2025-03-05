import mongoose, {Schema} from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const employeeAttendanceSchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            unique: true,
            index: true
        },
        employeeAttendanceDetails: [
            {
                date: {
                    type: String,
                    required: true,
                    index: true,
                },
                timeIn: {
                    type: String,
                    required: true,
                },
                timeOut: {
                    type: String,
                    required: true,
                },
                totalWorkDuration: {
                    type: String,
                    required: true,
                },
                status: {
                    type: String,
                    required: true,
                    default: "Absent"
                },
                assignment: {
                    type: String,
                    required: true,
                    default: ""
                }
            }
        ]
    }
)

employeeAttendanceSchema.pre('save', function(next) {
    const dates = this.employeeAttendanceDetails.map(detail => detail.date);
    const uniqueDates = new Set(dates);
    
    if (dates.length !== uniqueDates.size) {
        throw new ApiError(404, 'Duplicate dates are not allowed for the same employee')
    }
    next();
});

export const EmployeeAttendance = mongoose.model("EmployeeAttendance", employeeAttendanceSchema)