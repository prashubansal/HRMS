import mongoose, {Schema} from "mongoose";

const leaveTypeSchema = new Schema(
    {
        name: {
            type: String,
            lowercase: true,
            index: true
        }
    }
)

export const LeaveType = mongoose.model("LeaveType", leaveTypeSchema)