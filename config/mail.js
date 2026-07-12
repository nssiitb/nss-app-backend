require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("MAIL CONFIG TEST -> Email:", process.env.EMAIL, "| Pass:", process.env.EMAIL_PASS ? "EXISTS" : "UNDEFINED");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,

    // user: "viveknetha1978@gmail.com", 
    // pass: "ujix knfv cmab gcdp",

  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Mail configuration failed:", error.message);
  } else {
    console.log("Mail configuration successful!");
  }
});

module.exports = transporter;