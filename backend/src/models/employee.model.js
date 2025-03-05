import mongoose, {Schema} from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const employeeSchema = new Schema(
    {
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true, 
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


//encrypt the password
employeeSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//validate the password: returns true/false
employeeSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// generate access token
// as soon as jwt token is generated, it returns that token
employeeSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            //payload
            _id: this._id,
            email: this.email,
            designation: this.designation,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//generate refresh token
employeeSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            //payload
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Employee = mongoose.model("Employee", employeeSchema)