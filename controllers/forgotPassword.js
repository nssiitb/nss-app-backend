const db = require("../config/db");
const transporter = require("../config/mail");
const otpGenerator = require("otp-generator");

const forgotPassword = async (req, res) => {
    try {
        const { roll } = req.body;
        const [users] = await db.execute(
            "SELECT * FROM users WHERE roll = ?",
            [roll]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Roll number not found",
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCase: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        });

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.execute(
            `REPLACE INTO otp
            (roll, otp, expires_at, verified)
            VALUES (?, ?, ?, 0)`,
            [roll, otp, expiresAt]
        );

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: `${roll}@iitb.ac.in`,
            subject: "NSS App Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. This OTP is valid for 5 minutes.`,
        });

        res.json({
            status: 200,
            message: "OTP sent successfully",
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
};

module.exports = forgotPassword;