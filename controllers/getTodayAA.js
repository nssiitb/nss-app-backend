/*const db = require("../config/db");

const getTodayAA = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "yyyy-mm-dd"
    const [records] = await db.execute(
      `SELECT * FROM aa_attendance WHERE DATE(_timestamp_) = ?`,
      [today]
    );
    res.status(200).json({ records });
  } catch (err) {
    console.error("getTodayAA error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getTodayAA;

const db = require("../config/db");

const getTodayAA = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM aa_attendance WHERE DATE(_timestamp_) = CURDATE()`
    );
    res.status(200).json({ records: rows });
  } catch (err) {
    console.error("Error fetching AA records:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getTodayAA;*/

const db = require("../config/db");

const getTodayAA = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT _roll_, _name_, _timestamp_, _latitude_, _longitude_
       FROM aa_attendance
       WHERE DATE(_timestamp_) = CURDATE()`
    );

    res.status(200).json({ records: rows });
  } catch (error) {
    console.error("Error fetching today's AA attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getTodayAA;


