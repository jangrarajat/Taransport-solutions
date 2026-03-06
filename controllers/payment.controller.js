import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.model.js";
import dotenv from "dotenv"

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        let amount = planId === "monthly" ? 299900 : planId === "halfYearly" ? 1599900 : 3199900;

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        });
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        if (expectedSignature === razorpay_signature) {
            let months = planId === "monthly" ? 1 : planId === "halfYearly" ? 6 : 12;
            let expiry = new Date();
            expiry.setMonth(expiry.getMonth() + months);

            const updatedUser = await User.findByIdAndUpdate(req.user._id, {
                isPremium: true,
                premiumVersion: planId === "monthly" ? "Silver" : planId === "halfYearly" ? "Gold" : "Platinum",
                subscriptionEndDate: expiry
            }, { new: true });

            res.status(200).json({ success: true, user: updatedUser });
        } else {
            res.status(400).json({ success: false, message: "Invalid Payment Signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};