const serverError = (error, res) => {
    res.status(500).json({ success: false, message: "server error", error: error.message })
}

export { serverError }

