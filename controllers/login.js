const db = require("../config/db")

const loginUser = async (req, res) => {

    try {

        const data = req.body;
        const isaa = data.isaa;

        console.log(isaa);

        if (!isaa) {
            table = "users";
        }
        else {
            table = "admins"
        }

        const [rows] = await db.execute(`SELECT * FROM ${table} WHERE roll = ?`, [data.roll]);

        // no user exists
        if (rows.length == 0) {
            return res.status(400).json({
                userData: null,
                message: "No user exists",
                status: false
            });
        }
        // user exists
        else if (rows.length == 1) {
            const userPassword = rows[0].password;
            // correct password
            if (data.password == userPassword) {
                const userData = {
                    roll: rows[0].roll,
                    name: rows[0].name,
                    mobile: rows[0].mobile,
                    dept: rows[0].dept,
                    email: rows[0].email,
                    isaa: isaa,
                };
                return res.status(201).json({
                    userData: userData,
                    message: "Login successful",
                    status: true
                });
            }
            // wrong password 
            else {
                return res.status(201).json({
                    userData: null,
                    message: "Wrong password",
                    status: false
                });
            }
        }
    }
    catch {
        return res.status(500).json({
            userData: null,
            message: "Internal Server Error",
            status: false
        })
    }
}

module.exports = loginUser;