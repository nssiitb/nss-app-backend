const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const auth = require("../middleware/auth");

const loginUser = require("../controllers/login");
const registerUser = require("../controllers/register");
const logoutUser = require("../controllers/logout");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    userData: null,
    message: "Too many login attempts. Try again in 15 minutes.",
    status: false,
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many registration attempts. Try again later.",
    status: false,
  },
});
const eventsToday = require("../controllers/eventsToday");
const addEvent = require("../controllers/addEvent");
const allEvents = require("../controllers/allEvents");
const saveAddress = require("../controllers/attendanceAA");
const markAttendance = require("../controllers/markAttendance");
const getTodayAA = require("../controllers/getTodayAA");
const sendVolunteers = require("../controllers/sendVolunteers");
const sendHours = require("../controllers/sendHours");
const sendCalendar = require("../controllers/calendar");
const attByRoll = require("../controllers/attByRoll");
const forgotPassword = require("../controllers/forgotPassword");
const verifyOTP = require("../controllers/verifyOTP");
const resetPassword = require("../controllers/resetPassword");

router.post('/login', loginLimiter, loginUser);
router.post('/register', registerLimiter, registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.use(auth);
router.post('/logout', logoutUser);
router.get('/eventsToday', eventsToday);
router.post('/addEvent', addEvent);
router.get('/allEvents', allEvents);
router.post('/address', saveAddress);
router.post('/attendance', markAttendance);
router.get('/getTodayAA', getTodayAA);
router.get('/sendVolunteers', sendVolunteers);
router.post('/getHours', sendHours);
router.get('/calendar', sendCalendar);
router.post('/attByRoll', attByRoll);

module.exports = router;