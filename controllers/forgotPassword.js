const db = require("../config/db");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check in users table
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // Check in admins table
    const [admins] = await db.execute(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (users.length === 0 && admins.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Email not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Email found",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = forgotPassword;