const db = require("../config/db");

const attByDept = async (req, res) => {
    try {
        const { dept } = req.body;

        if (!dept) {
            return res.status(400).json({ message: "Department is required." });
        }

        const sqlQuery =
            "SELECT * FROM attendance WHERE _department_ = ? ORDER BY _timestamp_ DESC";

        const [rows] = await db.execute(sqlQuery, [dept]);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching attendance by department:", error);
        res.status(500).json({
            message: "Failed to retrieve attendance data."
        });
    }
};

module.exports = attByDept;