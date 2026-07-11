const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");

const db = require("../config/db");

// Precomputed bcrypt hash of a random string. Used to keep response time
// constant when the roll doesn't exist, so attackers can't enumerate users
// via timing differences.
const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8p8u.M9c9OQxq9WcU7q3aH3fL8vI2q";

const loginUser = async (req, res) => {
  try {
    const { roll, password, isaa } = req.body || {};

    if (typeof roll !== "string" || typeof password !== "string") {
      return res.status(400).json({
        userData: null,
        message: "Invalid request",
        status: false,
      });
    }

    const table = isaa === true ? "admins" : "users";

    const [rows] = await db.execute(
      `SELECT * FROM ${table} WHERE roll = ?`,
      [roll],
    );

    const user = rows[0];
    const hashToCompare = user ? user.password : DUMMY_HASH;
    const passwordMatch = await bcrypt.compare(password, hashToCompare);

    if (!user || !passwordMatch) {
      return res.status(401).json({
        userData: null,
        message: "Invalid credentials",
        status: false,
      });
    }

    const userData = {
      roll: user.roll,
      name: user.name,
      mobile: user.mobile,
      dept: user.dept,
      email: user.email,
      isaa: table === "admins",
    };

    const token = jwt.sign(
      { roll: user.roll, isaa: table === "admins" },
      process.env.JWT_SECRET,
      { expiresIn: "7d", jwtid: randomUUID() },
    );

    return res.status(200).json({
      token,
      userData,
      message: "Login successful",
      status: true,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      userData: null,
      message: "Internal Server Error",
      status: false,
    });
  }
};

module.exports = loginUser;
