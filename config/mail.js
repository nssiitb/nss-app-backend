require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-auth.iitb.ac.in",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  requireTLS: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Mail configuration failed:", error.message);
  } else {
    console.log("Mail configuration successful!");
  }
});

module.exports = transporter;
