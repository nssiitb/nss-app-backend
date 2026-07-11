const db = require("../config/db");
const bcrypt = require("bcrypt");

// At least 8 chars, one lowercase, one uppercase, one digit, one symbol.
const PASSWORD_POLICY =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const ROLL_POLICY = /^[A-Za-z0-9]{1,10}$/;
const MOBILE_POLICY = /^\d{10}$/;
const EMAIL_POLICY = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerUser = async (req, res) => {
  try {
    const { roll, name, mobile, dept, email, password, fingerprint } =
      req.body || {};

    if (
      typeof roll !== "string" ||
      typeof name !== "string" ||
      typeof mobile !== "string" ||
      typeof dept !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid request",
        status: false,
      });
    }

    if (!ROLL_POLICY.test(roll)) {
      return res.status(400).json({
        message: "Invalid roll number",
        status: false,
      });
    }
    if (!EMAIL_POLICY.test(email) || email.length > 50) {
      return res.status(400).json({
        message: "Invalid email",
        status: false,
      });
    }
    if (!MOBILE_POLICY.test(mobile)) {
      return res.status(400).json({
        message: "Invalid mobile number",
        status: false,
      });
    }
    if (name.length === 0 || name.length > 50) {
      return res.status(400).json({
        message: "Invalid name",
        status: false,
      });
    }
    if (dept.length === 0 || dept.length > 3) {
      return res.status(400).json({
        message: "Invalid department",
        status: false,
      });
    }
    if (!PASSWORD_POLICY.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, a digit, and a symbol",
        status: false,
      });
    }

    const [rows] = await db.execute(`SELECT roll FROM users WHERE roll = ?`, [
      roll,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({
        message: "User already exists",
        status: false,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.execute(
      `INSERT INTO users (roll, name, mobile, dept, email, password, fingerprint) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        roll,
        name,
        mobile,
        dept,
        email,
        hashedPassword,
        typeof fingerprint === "string" ? fingerprint : null,
      ],
    );

    return res.status(201).json({
      message: "User registered successfully",
      status: true,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

module.exports = registerUser;
