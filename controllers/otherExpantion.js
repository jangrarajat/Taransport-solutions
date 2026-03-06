import OtherExpantion from "../models/otherExpantion.model.js";
import { serverError } from "../utils/server.error.js";

const expantion = async (req, res) => {
    try {
        const { title, amount, expenseDate } = req.body || {}
        if ((!title && !amount) || !expenseDate) return res.status(400).json({ success: true, message: "All feailds are requried" })

        const saveExpantion = await OtherExpantion.create({
            userId: req.user._id,
            title: title,
            amount: amount,
            expenseDate: expenseDate
        })

        if (!saveExpantion) return res.status(400).json({ success: true, message: "Persnol expantion adding failed" })


        return res.status(200).json({ success: true, message: "Persnol expantion adding success", saveExpantion })


    } catch (error) {
        return res.status(500).json({ success: false, message: "server error", error: error.message })
    }
}

const getExpantions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const { title, month, year, search } = req.query;
        const skip = (page - 1) * limit;

        const currentDate = new Date();
        const monthNum = month ? parseInt(month) : currentDate.getMonth() + 1;
        const yearNum = year ? parseInt(year) : currentDate.getFullYear();

        const firstDay = new Date(yearNum, monthNum - 1, 1);
        const lastDay = new Date(yearNum, monthNum, 0);

        let query = {
            userId: req.user._id,
            expenseDate: { $gte: firstDay, $lte: lastDay }
        };

        if (title) query.title = title;

        if (search) {
            query.$or = [
                { "amount.1.paymentPurpes": { $regex: search, $options: 'i' } }, // Search in purpose
                { descraption: { $regex: search, $options: 'i' } },
                { expenseDate: { $regex: search, $options: 'i' } }
            ];
        }

        const expantions = await OtherExpantion.find(query).skip(skip).limit(limit).sort({ expenseDate: -1 });
        const total = await OtherExpantion.countDocuments(query);

        return res.status(200).json({
            success: true,
            message: "Get Expantion success",
            expantions,
            page,
            totalExpantion: total,
            totalPage: Math.ceil(total / limit)
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error", error: error.message });
    }
};

export { expantion, getExpantions };