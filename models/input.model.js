import mongoose, { Schema, model } from "mongoose";

const billSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    VehicleNo: {
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

    }, frightAmount: {
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
    vehicalPayedAmount: {
        type: Number,
        default: 0
    },
    vehicalPayedremark: {
        type: String,
        default: "nothing"
    }
    ,
    faynalAmmount: {
        type: Number,
        requried: true
    },


}, { timestamps: true })

const Billitry = model("Billitry", billSchema)
export default Billitry;