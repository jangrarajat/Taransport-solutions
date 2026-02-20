import jwt from "jsonwebtoken"
import User from "../models/user.model.js";


const verigyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        if (!token) return res.status(400).json({ success: false, message: "token requried" })
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) return res.status(400).json({ success: false, message: "Invalid token" })
        const user = await User.findById({ _id: decodedToken._id })
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message === "jwt expired" ? "jwt expired" : "token verifaction error",
            error: error.message

        })

    }
};


export default verigyJwt;