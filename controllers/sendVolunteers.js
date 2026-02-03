const db = require("../config/db");

const sendVolunteers = async (req, res) => {
    try {
        console.log("hit");
        const sqlQuery = "SELECT roll, name, mobile, dept, email, hours FROM users";
        const [rows] = await db.execute(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        res.status(500).json({ message: "Failed to retrieve volunteer data from the database." });
    }
    return;
}

module.exports = sendVolunteers;