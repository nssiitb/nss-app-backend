const { json } = require("express");
const db = require("../config/db");

// Calculates batch based on event date:
// May (5) to Dec (12) -> "YYYY-(YYYY+1)"
// Jan (1) to Apr (4)  -> "(YYYY-1)-YYYY"
const calculateBatch = (dateInput) => {
    const date = dateInput ? new Date(dateInput) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1 = Jan, 12 = Dec

    if (month >= 5) {
        return `${year}-${year + 1}`;
    } else {
        return `${year - 1}-${year}`;
    }
};

const addEvent = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);

        // 1. Calculate the batch from the event date (or current date if not provided)
        const batch = calculateBatch(data.date);

        // 2. Insert into events table including the calculated batch
        await db.execute(
            `INSERT INTO events (name, date, time, hours, AA, remarks, department, _batch_) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.name, data.date, data.time, data.hours, data.AA, data.remarks, data.department, batch]
        );

        res.status(201).json({
            message: 'Event added successfully',
            status: true,
            batch: batch
        });
    }
    catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({
            message: 'Internal Server Error',
            status: false
        });
    }
}

module.exports = addEvent;