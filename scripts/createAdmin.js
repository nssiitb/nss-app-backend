require("dotenv").config({ path: "../.env" }); // load main .env if running from scripts directory
const db = require("../config/db");
const bcrypt = require("bcrypt");

const createAdmin = async () => {
  try {
    const args = process.argv.slice(2);
    if (args.length < 6) {
      console.log(
        "Usage: node createAdmin.js <roll> <name> <mobile> <dept> <email> <password>",
      );
      process.exit(1);
    }

    const [roll, name, mobile, dept, email, password] = args;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.execute(
      `INSERT INTO admins (roll, name, mobile, dept, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [roll, name, mobile, dept, email, hashedPassword],
    );

    console.log(`Admin user ${name} (${roll}) created successfully!`);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.error("Error: An admin with this roll number already exists.");
    } else {
      console.error("Failed to create admin:", err);
    }
  } finally {
    process.exit(0);
  }
};

createAdmin();
