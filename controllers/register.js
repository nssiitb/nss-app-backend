const db = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const data = req.body;
    const [rows] = await db.execute(`SELECT * FROM users WHERE roll = ?`, [
      data.roll,
    ]);

    // check if user exists
    if (rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
        status: false,
      });
    }
    // if it doesn't, register it
    else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      await db.execute(
        `INSERT INTO users (roll, name, mobile, dept, email, password, fingerprint) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.roll,
          data.name,
          data.mobile,
          data.dept,
          data.email,
          hashedPassword,
          data.fingerprint,
        ],
      );

      res.status(201).json({
        message: "User registered successfully",
        status: true,
      });
    }
  } catch (error) {
    // if some error occurs
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

module.exports = registerUser;
