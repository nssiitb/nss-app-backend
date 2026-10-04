const db = require("../config/db");
const transporter = require("../config/mail");
const otpGenerator = require("otp-generator");

const forgotPassword = async (req, res) => {
  try {
    const { roll, mode, is_aa } = req.body;
    const tableName = is_aa ? "admins" : "users";
    const [users] = await db.execute(
      `SELECT * FROM ${tableName} WHERE roll = ?`,
      [roll],
    );

    if (mode === "signup") {
      if (users.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "User already exists",
        });
      }
    } else {
      if (users.length === 0) {
        return res.status(400).json({
          status: 400,
          message: "User not found",
        });
      }
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.execute(
      `REPLACE INTO otp
            (roll, otp, expires_at, verified)
            VALUES (?, ?, ?, 0)`,
      [roll, otp, expiresAt],
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
