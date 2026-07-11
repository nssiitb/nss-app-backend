const db = require("../config/db");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
    try {
        const { roll, password } = req.body;

        const [rows] = await db.execute(
            "SELECT * FROM otp WHERE roll = ?",
            [roll]
        );

        if (rows.length === 0 || rows[0].verified === 0) {
            return res.status(400).json({
                status: 400,
                message: "OTP verification required",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            "UPDATE users SET password = ? WHERE roll = ?",
            [hashedPassword, roll]
        );

        await db.execute(
            "DELETE FROM otp WHERE roll = ?",
            [roll]
        );

        res.json({
            status: 200,
            message: "Password updated successfully",
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
};

module.exports = resetPassword;