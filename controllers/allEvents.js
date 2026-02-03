const db = require("../config/db");

const allEvents = async (req, res) => {
    try {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const [rows] = await db.execute(`SELECT * FROM events WHERE date >= ?`, [todayString]);
        res.json({
            events: rows,
            status: 200,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = allEvents;
