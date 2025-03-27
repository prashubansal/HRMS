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
    app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
})
.catch((err) => {
    console.log("MONGODB connection failed !!! ", err);
    
})

