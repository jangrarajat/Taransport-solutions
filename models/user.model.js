import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    premiumVersion: { type: String, enum: ["Platinum", "Silver", "Gold"], default: null },
    // Naya subscription logic
    biltyCount: { type: Number, default: 0 },
    subscriptionEndDate: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    refreshToken: { type: String }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.pre(/^find/, function () {
    this.find({ isDeleted: { $ne: true } });
});

const User = model("User", userSchema);
export default User;