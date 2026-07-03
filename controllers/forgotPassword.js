const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const db = require('../config/db');

// 1. Send the Email via Flutter App
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "No one with this email" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const expireDate = new Date(Date.now() + 3600000); 
        const formattedExpiry = expireDate.toISOString().slice(0, 19).replace('T', ' ');

        await db.execute(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
            [resetToken, formattedExpiry, email]
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });

        // 🔥 FIX: Email link now points perfectly to the GET route
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'NSS App - Password Reset Link 🔐',
            text: `Hello ${users[0].name},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetLink}\n\n⚠️ This link will expire in 1 hour.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset link sent to your email!" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 2. Show the Webpage when link is clicked
exports.renderResetPage = (req, res) => {
    const token = req.query.token; 
    if (!token) {
        return res.status(400).send("Token is missing! Invalid link. ❌");
    }

    // 🔥 FIX: form action now points perfectly to the POST route
    const htmlForm = `
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; background-color: #f5f5f5; height: 100vh;">
            <h2 style="color: #1A2A5E;">Set New Password 🔐</h2>
            <p>Enter your new password below:</p>
            <form action="/update-password" method="POST" style="background: white; padding: 30px; border-radius: 10px; display: inline-block; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                <input type="hidden" name="token" value="${token}">
                <input type="password" name="newPassword" placeholder="Enter New Password" required style="padding: 10px; width: 250px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 5px;"><br>
                <button type="submit" style="padding: 10px 20px; background: #1A2A5E; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Update Password</button>
            </form>
        </div>
    `;
    res.send(htmlForm);
};

// 3. Update the Database when form is submitted
exports.updatePassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
            [token]
        );
        if (users.length === 0) {
            return res.send("<h2 style='color:red; text-align:center;'>❌ Invalid or Expired Link! Please request a new link from the app.</h2>");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.execute(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?',
            [hashedPassword, token]
        );

        res.send("<h2 style='color:green; text-align:center; margin-top: 50px;'>✅ Password Reset Successful! You can now login from the NSS App.</h2>");
    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).send("Server Error while updating password.");
    }
};