import mongoose, { Schema, model } from "mongoose"

const otherExpantion = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true
    },
    title: {
        type: String,
        requried: true,
        enum: ["salary", "bills", "other"]
    },
    amount: [{
        payedAmount: {
            type: Number,
            requried: true
        },
        paymentPurpes: {
            type: String,
            requried: true
        }
    }],
    descraption: {
        type: String,
        requried: true

    },
    expenseDate: {
        type: Date,
        default: new Date()
    }

}, { timestamps: true });

const OtherExpantion = model("otherExpantion", otherExpantion)

export default OtherExpantion;

