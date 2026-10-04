const db = require("../config/db");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
    console.log("RESET PASSWORD ROUTE HIT");
    try {
       const { roll, password, is_aa } = req.body;

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

        const tableName = is_aa ? "admins" : "users";

        await db.execute(
            `UPDATE ${tableName} SET password = ? WHERE roll = ?`,
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
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
};

module.exports = resetPassword;