import express from "express";
import dotenv from "dotenv";
import connectMongoDb from "./db/mongoDB.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import billRoute from "./routes/bill.route.js"
import expantionRoute from "./routes/otherExpantion.route.js"
import cors from "cors"

// configs

dotenv.config();
const app = express();
app.use(express.json());
connectMongoDb();
app.use(cookieParser());
app.use(cors())

// routes 
app.use('/user', userRoute)
app.use('/bill', billRoute)
app.use('/persnol', expantionRoute)

app.get('/', (req, res) => {
    res.status(200).send("hello transporters");
});


app.listen(process.env.PORT, () => {
    console.log(`app listen on Port${process.env.PORT}`);
});
