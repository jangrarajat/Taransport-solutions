import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true
    },
    name: {
        type: String,
        requried: true
    },
    number: {
        type: Number,
        requried: true
    },
    email: {
        type: String,
        requried: true
    },
    password: {
        type: String,
        requried: true
    },
    companyName: {
        type: String,
        requried: true
    },
    isPremium: {
        type: Boolean,
        default: false,

    },
    premiumVersion: {
        type: String,
        enum: ["Platinum", "Silver", "Gold"],
        default: null
    },
    isDeleted: { // Soft Delete (Data database me rahega par user ko nahi dikhega)
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true })


userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

userSchema.pre(/^find/, function () {
    this.find({ isDeleted: { $ne: true } })
})


const User = model("User", userSchema);

export default User

