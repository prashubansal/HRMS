import mongoose, {Schema} from "mongoose";

const employeeLeaveSchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            unique: true,
            index: true
        },
        employeeLeaveDetails: [
            {
                startDate: {
                    type: String,
                    required: true,
                    unique: true,
                    index: true
                },
                endDate: {
                    type: String,
                    required: true,
                    unique: true,
                    index: true
                },
                days: {
                    type: Number,
                    required: true,
                },
                planningType: {
                    type: String,
                    required: true
                },
                leaveType: {
                    type: String,
                    required: true
                },
                leaveDuration: {
                    type: String,
                    required: true,
                },
                leaveStatus: {
                    type: String,
                    required: true,
                    default: "Pending"
                },
                leaveReason: {
                    type: String,
                    required: true,
                    default: ""
                }
            }
        ]
    }
)

export const EmployeeLeave = mongoose.model("EmployeeLeave", employeeLeaveSchema)