const db = require("../config/db");

const verifyOTP = async (req, res) => {
    try {
        const { roll, otp } = req.body;

        const [rows] = await db.execute(
            "SELECT * FROM otp WHERE roll = ?",
            [roll]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "OTP not found",
            });
        }

        const record = rows[0];

        if (record.otp !== otp) {
            return res.status(400).json({
                status: 400,
                message: "Invalid OTP",
            });
        }

        if (new Date() > new Date(record.expires_at)) {
            return res.status(400).json({
                status: 400,
                message: "OTP has expired",
            });
        }

        await db.execute(
            "UPDATE otp SET verified = 1 WHERE roll = ?",
            [roll]
        );

        res.json({
            status: 200,
            message: "OTP verified",
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
};

module.exports = verifyOTP;