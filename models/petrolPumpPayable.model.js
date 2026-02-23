import mongoose, { Schema, model } from "mongoose";

const petrolPump = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true
    },
    petrolPumpName: {
        type: String,
        requried: true
    },
    amount: {
        type: Number,
        requried: true
    },
    payment: {
        type: String,
        enum: ["unpayed", "payed"],
        default: "unpayed"
    },



}, { timestamps: true });

const PetrolPump = model("PetrolPump", petrolPump);

export default PetrolPump;