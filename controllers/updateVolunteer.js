const db = require('../config/db'); // Database connection configuration

// 1. Update Volunteer Controller
const updateVolunteer = async (req, res) => {
  try {
    const requester = req.user; // Get logged-in admin details from JWT middleware
    const { roll, name, mobile, dept, email } = req.body;

    if (!roll) {
      return res.status(400).json({ error: "Roll number is required" });
    }

    // Verify if the requester is CTM or AA
    const isCTM = requester.isctm === true || requester.isctm === 1;
    const isAA = requester.isaa === true;

    if (!isCTM && !isAA) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    if (isCTM) {
      // CTM has full access to update all volunteer details: name, mobile, dept, email
      const query = `UPDATE admins SET name = ?, mobile = ?, dept = ?, email = ? WHERE roll = ?`;
      await db.query(query, [name, mobile, dept, email, roll]);
      return res.json({ message: "Volunteer updated successfully by CTM" });
    } else if (isAA) {
      // AA is restricted: can ONLY update the department! Ignore other fields.
      const query = `UPDATE admins SET dept = ? WHERE roll = ?`;
      await db.query(query, [dept, roll]);
      return res.json({ message: "Department updated successfully by AA" });
    }
  } catch (err) {
    console.error("Error updating volunteer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Delete Volunteer Controller (Strictly restricted to CTM only)
const deleteVolunteer = async (req, res) => {
  try {
    const requester = req.user;
    const { roll } = req.params;

    const isCTM = requester.isctm === true || requester.isctm === 1;
    if (!isCTM) {
      return res.status(403).json({ error: "Only CTM can delete users" });
    }

    const query = `DELETE FROM admins WHERE roll = ?`;
    await db.query(query, [roll]);
    res.json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    console.error("Error deleting volunteer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateVolunteer, deleteVolunteer };