const db = require("../config/db");

const attByEvent = async (req, res) => {
    try {
        const { event } = req.body;

        if (!event) {
            return res.status(400).json({ message: "Event name is required." });
        }

        const sqlQuery = 
            "SELECT * FROM attendance WHERE _event_ = ? ORDER BY _timestamp_ DESC";

        const [rows] = await db.execute(sqlQuery, [event]);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching attendance by event:", error);
        res.status(500).json({
            message: "Failed to retrieve attendance data."
        });
    }
};

module.exports = attByEvent;