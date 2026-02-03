const db = require("../config/db")

const sendHours = async (req, res) => {
    try {

        const { roll } = req.body;

        if (!roll) {
            return res.status(400).json({
                hours: null,
                message: "Roll number is required.",
                status: false
            });
        }

        const [rows] = await db.execute(`SELECT hours FROM users WHERE roll = ?`, [roll]);

        if (rows.length === 0) {
            return res.status(404).json({
                hours: null,
                message: "User not found.",
                status: false
            });
        }

        const completedHours = rows[0].hours;
        
        return res.status(200).json({
            hours: completedHours,
            message: "Hours retrieved successfully.",
            status: true
        });

    } catch (error) {
        console.error("Error fetching hours:", error);
        return res.status(500).json({
            hours: null,
            message: "Internal Server Error.",
            status: false
        });
    }
}

module.exports = sendHours;
