
const addBillEntry = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "bill entery successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error", error: error.message })
    }
};

export { addBillEntry };