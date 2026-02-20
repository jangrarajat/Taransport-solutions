import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { options } from "../utils/cookie.option.js";


const registration = async (req, res) => {
   try {
      const { name, number, email, password, companyName } = req.body || {}
      console.log(req.body)

      // empty feilds error
      if (!name || !number || !email || !password || !companyName) return res.status(400).json({ success: false, message: "All fields are requried" });

      // check User Exist
      const checkUserExist = User.find({
         $or: [
            { email: email },
            { number: number }
         ]
      })
      if (checkUserExist) return res.status(400).json({ success: false, message: "User already exist" });



      // create new user
      const user = await User.create({
         name: name,
         number: number,
         email: email,
         password: password,
         companyName: companyName
      })

      const findUser = User.find({
         $or: [
            { email: email },
            { number: number }
         ]
      }).select('-password')
      if (!findUser) return res.status(400).json({ success: false, message: "Registration failed" });



      return res.status(200).json({ success: true, message: "Registration success", findUser });
   } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
      console.log(error.message)
      throw error
   }

}


const login = async (req, res) => {
   try {
      const { number, email, password } = req.body || {}
      if ((!number && !email) || !password) return res.status(400).json({ success: false, message: "All fields are requried" });

      const user = await User.findOne({
         $or: [
            { email: email },
            { number: number }
         ]
      })
      if (!user) return res.status(400).json({ success: false, message: "User not exist" });

      const checkPassword = await bcrypt.compare(password, user.password)
      if (!checkPassword) return res.status(400).json({ success: false, message: "Wrong password" });

      const token = await jwt.sign({
         _id: user._id,
         number: number,
         email: email
      }, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: process.env.ACCESS_TOKEN_EXPIR
      })

      const refreshToken = await jwt.sign({
         _id: user._id,
         number: number,
         email: email
      }, process.env.ACCESS_RETOKEN_SECRET, {
         expiresIn: process.env.ACCESS_RETOKEN_EXPIR
      })

      await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken })
      const responseUser = await User.findById({ _id: user._id }).select('-password -refreshToken')




      return res.status(200)
         .cookie("token", token, options)
         .cookie("refreshToken", refreshToken, options)
         .json({
            success: true,
            message: "Login success",
            responseUser
         });


   } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
      console.log(error.message)
      throw error
   }

}


const logout = async (req, res) => {
   try {
      const options = { httpOnly: true, secure: false, sameSite: 'strict' }

      await User.findByIdAndUpdate(req.user._id, { refreshToken: "" })

      return res.status(200).clearCookie("token", options).clearCookie("refreshToken", options).json({ success: true, message: "Logout success" })

   } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" })
   }
}

const refreshExpriedToken = async (req, res) => {
   try {
      const refreshToken = req.cookies?.refreshToken
      if (!refreshToken) return res.status(400).json({ success: false, message: "refreshTOken not fount" })
      const decodeRefreshToken = await jwt.verify(refreshToken, process.env.ACCESS_RETOKEN_SECRET)

      const user = await User.findById(decodeRefreshToken._id);
      if (!user) return res.status(400).json({ success: false, message: "User not  fount" })
    
      if (user.refreshToken !== refreshToken) return res.status(400).json({ success: false, message: "Mismatch refreshToken"})

      const newToken = await jwt.sign({
         _id: user._id,
         number: user.number,
         email: user.email
      }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIR })

      return res.status(201).cookie("token", newToken, options).json({success:true , message:"Token refresh success"})

   } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message })
   }
}

export { registration, login, logout, refreshExpriedToken }