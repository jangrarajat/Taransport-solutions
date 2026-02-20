import mongoose, { Schema, model } from "mongoose";
import User from "./user.model.js";

const billSchema = new Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        requried: true

    },
    InvoiceNo: {
        type: String,
        requried: true
    },
    DateOfIssueOfInvoice: {
        type: String,
        requried: true
    },
    NameOfRecipient: {
        type: String,
        requried: true
    },
    GSTINNo: {
        type: String,
        requried: true
    },
    Quantity: {
        type: String,
        requried: true
    },
    Packages: {
        type: String,
        requried: true
    },
    LRNO: {
        type: String,
        requried: true
    },
    LRNORRNO: {
        type: String,
        requried: true
    },
    VehicleNo: {
        type: String,
        requried: true
    },
    ChallanNo: {
        type: String,
        requried: true
    },
    Destination: {
        type: String,
        requried: true
    },
    DONo: {
        type: String,
        requried: true
    },
    DINo: {
        type: String,
        requried: true
    },
    TotalInvoiceValue: {
        type: String,
        requried: true

    },


}, { timestamps: true })

const Billitry = model("Billitry", billSchema)
export default Billitry;