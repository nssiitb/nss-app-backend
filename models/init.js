const db = require("../config/db");

const initDatabase = async () => {
  try {
    console.log("Initializing database tables...");

    // 1. users table
    await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                roll VARCHAR(10) NOT NULL,
                name VARCHAR(50) NOT NULL,
                mobile VARCHAR(10) NOT NULL,
                dept VARCHAR(3) NOT NULL,
                email VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                hours INT NOT NULL DEFAULT 0,
                fingerprint VARCHAR(255),
                PRIMARY KEY (roll)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

    // 2. events table
    await db.execute(`
            CREATE TABLE IF NOT EXISTS events (
                name VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                time TIME NOT NULL,
                hours INT NOT NULL,
                AA VARCHAR(10) NOT NULL,
                remarks VARCHAR(100) NOT NULL,
                department VARCHAR(255) NOT NULL,
                PRIMARY KEY (name, date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

    // 3. attendance table
    await db.execute(`
            CREATE TABLE IF NOT EXISTS attendance (
                _roll_ VARCHAR(15) NOT NULL,
                _name_ VARCHAR(255) NOT NULL,
                _department_ VARCHAR(255) NOT NULL,
                _timestamp_ TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                _latitude_ VARCHAR(255) NOT NULL,
                _longitude_ VARCHAR(255) NOT NULL,
                _fingerprint_ TEXT NOT NULL,
                _status_ INT NOT NULL,
                _message_ VARCHAR(255) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

    // 4. admins table
    await db.execute(`
            CREATE TABLE IF NOT EXISTS admins (
                roll VARCHAR(10) NOT NULL,
                name VARCHAR(50),
                mobile VARCHAR(10),
                dept VARCHAR(10),
                email VARCHAR(50) NOT NULL,
                password VARCHAR(255),
                PRIMARY KEY (roll)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

    // 5. aa_attendance table
    await db.execute(`
            CREATE TABLE IF NOT EXISTS aa_attendance (
                _roll_ VARCHAR(15) NOT NULL,
                _name_ VARCHAR(255) NOT NULL,
                _timestamp_ TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                _latitude_ VARCHAR(255) NOT NULL,
                _longitude_ VARCHAR(255) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

    console.log("Database tables initialized successfully!");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    process.exit(1);
  }
};

module.exports = initDatabase;
