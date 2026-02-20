import Billitry from "../models/input.model.js";

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
            LRNORRNO,
            VehicleNo,
            ChallanNo,
            Destination,
            DONo,
            DINo,
            TotalInvoiceValue } = req.body || {}


        if (!InvoiceNo || !DateOfIssueOfInvoice || !NameOfRecipient ||
            !GSTINNo || !Quantity || !Packages || !LRNO || !LRNORRNO || !VehicleNo ||
            !ChallanNo || !Destination || !DONo || !DINo || !TotalInvoiceValue) return res.status(400).json({ success: false, message: "All fields are requried" });


        const existBill = await Billitry.findOne({ InvoiceNo })

        if (existBill) return res.status(400).json({ success: false, mussage: "Invoice already exists" })

        const bill = await Billitry.create({
            InvoiceNo: InvoiceNo,
            DateOfIssueOfInvoice: DateOfIssueOfInvoice,
            NameOfRecipient: NameOfRecipient,
            GSTINNo: GSTINNo,
            Quantity: Quantity,
            Packages: Packages,
            LRNO: LRNO,
            LRNORRNO: LRNORRNO,
            VehicleNo: VehicleNo,
            ChallanNo: ChallanNo,
            Destination: Destination,
            DONo: DONo,
            DINo: DINo,
            TotalInvoiceValue: TotalInvoiceValue
        })

        if (!bill) return res.status(400).json({ success: false, message: "bill entry failed" })




        return res.status(200).json({ success: true, message: "bill entery successfully", bill })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error", error: error.message })
    }
};

const getBiity = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20

        const skip = (page - 1) * limit

        const bills = await Billitry.find().skip(skip).limit(limit)

        const total = await Billitry.countDocuments()

        return res.status(200).json({
            success: true,
            message: "Get bilitry success",
            bills,
            page: page,
            totalBilitrys: total,
            totalPage: Math.ceil(total / limit)
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: "server error", error: error.message })
    }
}

export { addBillEntry, getBiity };