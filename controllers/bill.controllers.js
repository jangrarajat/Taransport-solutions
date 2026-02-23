import Tranjactions from "../models/dispatch.model.js";
import Billitry from "../models/input.model.js";
import PetrolPump from "../models/petrolPumpPayable.model.js";




const addBillEntry = async (req, res) => {
    try {
        const {
            InvoiceNo,
            DateOfIssueOfInvoice,
            NameOfRecipient,
            GSTINNo,
            Quantity,
            Packages,
            LRNO,
            VehicleNo,
            Destination,
            ratePMT,
            advanceCash,
            desilOnRent,
            petrolPump,
            DONo,
            DINo,
            TotalInvoiceValue } = req.body || {}



        //   cheaking requried feild 
        if (!InvoiceNo || !DateOfIssueOfInvoice || !NameOfRecipient ||
            !GSTINNo || !Quantity || !Packages || !LRNO || !VehicleNo ||
            !Destination || !DONo || !DINo || !TotalInvoiceValue || !desilOnRent) return res.status(400).json({ success: false, message: "All fields are requried" });



        //    checking billtry already exist are not
        const existBill = await Billitry.findOne({ userId: req.user._id, InvoiceNo })

        if (existBill) return res.status(400).json({ success: false, mussage: "Invoice already exists" })



        // calsulating trip astimates
        const frightAmount = Quantity * ratePMT
        const cometion = Quantity * 20
        let tripBalanceAmmount = frightAmount - advanceCash
        tripBalanceAmmount = tripBalanceAmmount - desilOnRent
        tripBalanceAmmount = tripBalanceAmmount - cometion



        console.log("frightAmount", frightAmount, "|", "tripBalanceAmmount", tripBalanceAmmount, "|", "faynalAmmount", tripBalanceAmmount)

        // saving petrolpump detailes error

        if (desilOnRent && petrolPump) {
            const saveRentDesion = await PetrolPump.create({
                petrolPumpName: petrolPump,
                amount: desilOnRent,
                userId: req.user._id
            })
            if (!saveRentDesion) return res.status(400).json({ success: false, message: "Petrol pump save detaild failed" })
        }



        // trip money tranjactions and total balance 
        const saveTripTranjactions = await Tranjactions.create({
            userId: req.user._id,
            frightAmount: frightAmount,
            vehicalNO: VehicleNo,
            advanceCash: advanceCash,
            desil: desilOnRent,
            petrolPump: petrolPump,
            commeion: cometion,
            tripBalanceAmmount: tripBalanceAmmount,
            faynalAmmount: tripBalanceAmmount,

        })

        if (!saveTripTranjactions) return res.status(400).json({ success: false, message: "Trip Tranjactions entry failed" })


        //   billity 
        const bill = await Billitry.create({
            userId: req.user._id,
            InvoiceNo: InvoiceNo,
            DateOfIssueOfInvoice: DateOfIssueOfInvoice,
            NameOfRecipient: NameOfRecipient,
            GSTINNo: GSTINNo,
            Quantity: Quantity,
            Packages: Packages,
            LRNO: LRNO,
            VehicleNo: VehicleNo,
            Destination: Destination,
            DONo: DONo,
            DINo: DINo,
            frightAmount: frightAmount,
            faynalAmmount: tripBalanceAmmount,
            tripBalanceAmmount: tripBalanceAmmount,
            TotalInvoiceValue: TotalInvoiceValue
        })
        if (!bill) return res.status(400).json({ success: false, message: "bill entry failed" })




        return res.status(200).json({ success: true, message: "bill entery successfully", bill })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "server error", error: error.message })
    }
}

const getBiity = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const { month, year } = req.query
        const skip = (page - 1) * limit

        const currentDate = new Date()

        const monthNum = month ? parseInt(month) : currentDate.getMonth() + 1
        const yearNum = year ? parseInt(year) : currentDate.getFullYear()

        const firstDay = new Date(yearNum, monthNum - 1, 1)
        const lastDay = new Date(yearNum, monthNum, 0)

        const bills = await Billitry.find({
            userId: req.user._id,
            createdAt: {
                $gte: firstDay,
                $lte: lastDay
            }
        }).skip(skip).limit(limit)

        const total = await Billitry.countDocuments({
            userId: req.user._id,
            createdAt: {
                $gte: firstDay,
                $lte: lastDay
            }
        })

        return res.status(200).json({
            success: true,
            message: "Get bilitry success",
            bills,
            page,
            totalBilitrys: total,
            totalPage: Math.ceil(total / limit)
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}


const getPetrolPump = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const { month, year } = req.query
        const skip = (page - 1) * limit

        const currentDate = new Date()

        const monthNum = month ? parseInt(month) : currentDate.getMonth() + 1
        const yearNum = year ? parseInt(year) : currentDate.getFullYear()

        const firstDay = new Date(yearNum, monthNum - 1, 1)
        const lastDay = new Date(yearNum, monthNum, 0)

        const pumpData = await PetrolPump.find({
            userId: req.user._id,
            createdAt: {
                $gte: firstDay,
                $lte: lastDay
            }
        }).skip(skip).limit(limit)

        const total = await PetrolPump.countDocuments({
            userId: req.user._id,
            createdAt: {
                $gte: firstDay,
                $lte: lastDay
            }
        })

        return res.status(200).json({
            success: true,
            message: "Get petrolpump Data success",
            pumpData,
            page,
            totalPumpData: total,
            totalPage: Math.ceil(total / limit)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}

const updatePetrolPumpPaymentStatus = async (req, res) => {
    try {
        const id = req.params.id?.trim()
        console.log(id)
        const payment = req.query.payment

        if (!payment) {
            return res.status(400).json({
                success: false,
                message: "payment field required"
            })
        }

        if (!["unpayed", "payed"].includes(payment)) {
            return res.status(400).json({
                success: false,
                message: "payment must be 'unpayed' or 'payed'"
            })
        }



        const updatedData = await PetrolPump.findByIdAndUpdate(
            id,
            { payment: payment },
            { returnDocument: "after" }   
        )

        return res.status(200).json({
            success: true,
            message: "Payment status updated",
            updatedData
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}


export { addBillEntry, getBiity, getPetrolPump, updatePetrolPumpPaymentStatus };