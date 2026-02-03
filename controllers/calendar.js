const db = require("../config/db");

const sendCalendar = async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM events`);
        res.json(rows);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = sendCalendar;