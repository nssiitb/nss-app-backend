const db = require('../config/db');

// 1. Update Volunteer Details
const updateVolunteer = async (req, res) => {
  try {
    const requester = req.user; // Retrieved from auth middleware
    const { roll, name, mobile, dept, email } = req.body;

    if (!roll) {
      return res.status(400).json({ error: "Roll number is required" });
    }

    const isCTM = requester.isctm === true || requester.isctm === 1;
    const isAA = requester.isaa === true;

    if (!isCTM && !isAA) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    if (isCTM) {
      // CTM can update all fields
      const query = `UPDATE users SET name = ?, mobile = ?, dept = ?, email = ? WHERE roll = ?`;
      await db.query(query, [name, mobile, dept, email, roll]);
      return res.json({ message: "Volunteer updated successfully by CTM" });
    } else if (isAA) {
      // AA can only update the department
      const query = `UPDATE users SET dept = ? WHERE roll = ?`;
      await db.query(query, [dept, roll]);
      return res.json({ message: "Department updated successfully by AA" });
    }
  } catch (err) {
    console.error("Error updating volunteer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Delete Volunteer (CTM only)
const deleteVolunteer = async (req, res) => {
  try {
    const requester = req.user;
    const { roll } = req.params;

    const isCTM = requester.isctm === true || requester.isctm === 1;
    if (!isCTM) {
      return res.status(403).json({ error: "Only CTM can delete users" });
    }

    const query = `DELETE FROM users WHERE roll = ?`;
    await db.query(query, [roll]);
    return res.json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    console.error("Error deleting volunteer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVolunteerProgress = async (req, res) => {
  const { roll } = req.params;
  const targetSem = req.query.sem || 'Autumn-2026';

  try {
    // 1. Volunteer department fetch cheyali
    const [userRows] = await db.query(
      'SELECT dept FROM users WHERE roll = ?', 
      [roll]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer profile not found' 
      });
    }

    const volunteerDept = userRows[0].dept;

    // 2. Events & Attendance join query
    const query = `
      SELECT 
        e.id AS event_id,
        e.name AS event_name,
        DATE_FORMAT(e.date, '%Y-%m-%d') AS date,
        e.hours,
        e.department,
        e.sem,
        CASE 
          WHEN a._status_ = 1 OR a.id IS NOT NULL THEN 'PRESENT'
          ELSE 'ABSENT'
        END AS status,
        a._timestamp_ AS attended_at
      FROM events e
      LEFT JOIN attendance a 
        ON e.id = a.event_id AND a._roll_ = ?
      WHERE e.sem = ?
        AND (e.department = 'ALL' 
             OR FIND_IN_SET(?, e.department) > 0 
             OR e.department = ?)
      ORDER BY e.date ASC;
    `;

    const [eventsList] = await db.query(query, [roll, targetSem, volunteerDept, volunteerDept]);

    // 3. Completed hours calculate cheyali
    const completedHours = eventsList.reduce((sum, item) => {
      return item.status === 'PRESENT' ? sum + Number(item.hours) : sum;
    }, 0);

    return res.json({
      success: true,
      roll: roll,
      department: volunteerDept,
      selectedSem: targetSem,
      completedHours: completedHours,
      requiredHours: 40,
      totalEventsCount: eventsList.length,
      events: eventsList
    });

  } catch (error) {
    console.error('Error fetching volunteer progress:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching attendance history' 
    });
  }
};

module.exports = { updateVolunteer, deleteVolunteer, getVolunteerProgress };