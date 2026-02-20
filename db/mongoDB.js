import mongoose from "mongoose";


const connectMongoDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB)
        console.log("mongoDb connected")
    } catch (error) {
        console.log("data base connection error", error.message)
        throw error
    }
}

export default connectMongoDb