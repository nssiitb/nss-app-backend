const db = require("../config/db");

const eventsToday = async (req, res) => {
  try {
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    const [rows] = await db.execute(`SELECT * FROM events WHERE date = ?`, [
      todayString,
    ]);
    res.json({
      events: rows,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = eventsToday;
