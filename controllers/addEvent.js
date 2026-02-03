const { json } = require("express");
const db = require("../config/db");

const addEvent = async (req, res) => {

    try {
        
        const data = req.body;
        console.log(data);

        await db.execute(
            `INSERT INTO events (name, date, time, hours, AA, remarks, department) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.name, data.date, data.time, data.hours, data.AA, data.remarks, data.department]
        );
        res.status(201).json({
            message: 'Event added successfully',
            status: true
        });
    }
    catch {
        res.status(500).json({
            message: 'Internal Server Error',
            status: false
        });
    }
}

module.exports = addEvent;