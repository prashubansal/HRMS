import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, // Replace with your client URL
    credentials: true // Allow cookies to be sent to the server when coming from the client-side
}))

app.use(cookieParser())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))


// routes import

import employeeRouter from './routes/employee.routes.js'

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        corsOrigin: process.env.CORS_ORIGIN
    })
})

// routes declaration
//whenever the request contains "/api/v1/users" direct it to the userRouter in user.routes.js
app.use("/api/v1/employees", employeeRouter)

// http://localhost:3000/api/v1/users/register

export {app}
