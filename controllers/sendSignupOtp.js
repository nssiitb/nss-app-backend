const db = require("../config/db");
const transporter = require("../config/mail");
const otpGenerator = require("otp-generator");

const sendSignupOtp = async (req, res) => {
    try {
        const { roll } = req.body;
        
        // 🚨 CHECK 1: User already unte block cheyali
        const [users] = await db.execute(
            "SELECT * FROM users WHERE roll = ?",
            [roll]
        );

        if (users.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "User already exists! Please Login.",
            });
        }

        // ✅ CHECK 2: User ledu kabatti OTP generate chey
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false, 
            specialChars: false,
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
            to: `${roll}@iitb.ac.in`, // Sending to your IITB mail
            subject: "NSS App Verify Email OTP",
            text: `Your OTP for NSS App registration is ${otp}. Valid for 5 minutes.`,
        });

        res.json({
            status: 200,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error("🔥 FATAL SIGNUP OTP ERROR:", error);
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
};

exports.sendSignupOtp = sendSignupOtp;