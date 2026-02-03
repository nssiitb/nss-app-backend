const db = require("../config/db");
const geolib = require("geolib");

const markAttendance = async (req, res) => {
  try {
    const {
      _roll_,
      _name_,
      _timestamp_,
      _latitude_,
      _longitude_,
      _department_,
      _message_,
      _fingerprint_,
      aa_roll
    } = req.body;

    const [aaRecords] = await db.execute(
      `SELECT * FROM aa_attendance WHERE _roll_ = ? AND DATE(_timestamp_) = CURDATE() ORDER BY _timestamp_ ASC LIMIT 1`,
      [aa_roll]
    );

    if (aaRecords.length === 0) {
      return res.status(400).json({ message: "Too early. AA has not started attendance today." });
    }

    const aa = aaRecords[0];
    const aaTime = new Date(aa._timestamp_);
    const userTime = new Date(_timestamp_);

    const timeDiff = Math.abs(userTime - aaTime) / (1000 * 60);
    const timeValid = (userTime >= aaTime && timeDiff <= 15);

    const distance = geolib.getDistance(
      { latitude: parseFloat(_latitude_), longitude: parseFloat(_longitude_) },
      { latitude: parseFloat(aa._latitude_), longitude: parseFloat(aa._longitude_) }
    );
    const distanceValid = (distance <= 200);

    const [existingToday] = await db.execute(
      `SELECT _roll_, _message_ FROM attendance 
       WHERE _fingerprint_ = ? AND DATE(_timestamp_) = CURDATE()`,
      [_fingerprint_]
    );

    if (existingToday.length > 0) {
      const sameRollEvents = existingToday.filter(row => row._roll_ === _roll_);
      const sameEventSameRoll = sameRollEvents.find(row => row._message_ === _message_);
      if (sameEventSameRoll) {
        return res.status(403).json({
          message: "Duplicate: You already marked attendance for this event today.",
          status: false
        });
      }

      const hasDifferentRoll = existingToday.some(row => row._roll_ !== _roll_);
      if (hasDifferentRoll) {
        return res.status(403).json({
          message: "This device has already been used by another account today.",
          status: false
        });
      }
    }

    if (timeValid && distanceValid) {
      await db.execute(
        `INSERT INTO attendance
        (_roll_, _name_, _timestamp_, _latitude_, _longitude_, _department_, _status_, _message_, _fingerprint_)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          _roll_,
          _name_,
          _timestamp_,
          _latitude_,
          _longitude_,
          _department_,
          1,
          _message_,
          _fingerprint_ || "1"
        ]
      );

      const [[eventRow]] = await db.execute(
        `SELECT hours FROM events 
     WHERE name = ? AND AA = ? AND DATE(date) = CURDATE()
     ORDER BY date DESC LIMIT 1`,
        [_message_, aa_roll]
      );

      if (!eventRow) {
        console.warn("No event matched to fetch hours for", _message_, aa_roll);
        return res.status(404).json({ message: "Matching event not found for hours update." });
      }

      const eventHours = parseFloat(eventRow?.hours || 0);

      await db.execute(
        `UPDATE users SET hours = hours + ? WHERE roll = ?`,
        [eventHours, _roll_]
      );

      return res.status(201).json({
        message: `Attendance marked successfully. +${eventHours} hrs added.`,
        status: true
      });
    }
    if (!timeValid) {
      return res.status(403).json({ message: "Invalid time. Attendance window expired or too early." });
    }

    if (!distanceValid) {
      return res.status(403).json({ message: "You are too far from the AA (more than 200 meters)." });
    }

  } catch (err) {
    console.error("Attendance error:", err);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

module.exports = markAttendance;
