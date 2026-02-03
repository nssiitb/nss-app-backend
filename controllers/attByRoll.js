// controllers/attByRoll.js
const db = require("../config/db");

const attByRoll = async (req, res) => {
    try {
        const { roll } = req.body;

        if (!roll) {
            return res.status(400).json({ message: "Roll number is required." });
        }

        // We select all columns where the roll matches.
        // Based on attendance.dart, the column is likely named '_roll_'
        // If your DB uses 'roll' without underscores for the attendance table, change `_roll_` to `roll` below.
        const sqlQuery = "SELECT * FROM attendance WHERE _roll_ = ? ORDER BY _timestamp_ DESC";
        
        const [rows] = await db.execute(sqlQuery, [roll]);

        // The frontend expects a list of objects. 
        // rows is already an array of objects matching the DB columns 
        // (e.g., { _roll_: "123", _timestamp_: "...", _message_: "Event", ... })
        // This matches perfectly with the Flutter code: record['_timestamp_']
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching attendance by roll:", error);
        res.status(500).json({ message: "Failed to retrieve attendance data." });
    }
};

module.exports = attByRoll;