import mongoose, { Schema, model } from "mongoose";
 
const tranjactions = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true
    },
    frightAmount: {
        type: Number,
        requried: true
    },
    vehicalNO: {
        type: String,
        requried: true
    },
    advanceCash: {
        type: Number,

    },
    desil: {
        type: Number,

    },
    petrolPump: {
        type: String,

    },
    commeion: {
        type: Number,
        requried: true
    },
    tripBalanceAmmount: {
        type: Number,
        requried: true
    },
    vehicalPayed: [{
        amount: {
            type: Number,
            default: 0
        },
        remark: {
            type: String,
            default: "nothing"
        }
    }],
    faynalAmmount: {
        type: Number,
        requried: true
    },


}, { timestamps: true })

const Tranjactions = model("Tranjactions", tranjactions)

export default Tranjactions;