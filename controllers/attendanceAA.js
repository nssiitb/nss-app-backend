const db = require("../config/db");

const saveAddress = async (req, res) => {
  try {
    const { _roll_, _name_, _timestamp_, _latitude_, _longitude_ } = req.body;

    const query = `
      INSERT INTO aa_attendance (_roll_, _name_, _timestamp_, _latitude_, _longitude_)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(query, [_roll_, _name_, _timestamp_, _latitude_, _longitude_]);

    return res.status(201).json({
      message: "Attendance recorded",
      status: true
    });
  } catch (err) {
    console.error("Address error:", err);
    return res.status(500).json({
      message: "Internal server error",
      status: false
    });
  }
};

module.exports = saveAddress;
