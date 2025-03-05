import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from './app.js'


dotenv.config({
    path: '.env'
})

const port = process.env.PORT || 9000

connectDB()
.then(() => {
    // check if our "express" app is able to talk to DB or not
    app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error
    })
    // start listening through express app
    app.listen(port, () => {
        console.log(`Server is running at port : ${port}`);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed !!! ", err);
    
})

