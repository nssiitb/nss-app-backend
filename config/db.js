const mysql = require('mysql2');

const pool = mysql.createPool({
  host: "localhost",
  user: 'root',
  password: '',
  database: 'nssapp',
});

// ------------ TESTING THE CONNECTION -------------
const testConnection = async () => {
  try {
    await pool.execute('SELECT 1');
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};
testConnection();
// -------------------------------------------------

module.exports = pool.promise();