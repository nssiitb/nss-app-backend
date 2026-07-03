const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");

const loginUser = require("../controllers/login");
const registerUser = require("../controllers/register");
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

// 🔥 FIX: Import ALL three functions perfectly!
const { forgotPassword, renderResetPage, updatePassword } = require('../controllers/forgotPassword');

// 🔓 PUBLIC ROUTES (No Token Needed)
router.post('/login', loginUser);
router.post('/register', registerUser);

// 🔥 THE PASSWORD RESET TRINITY (Correct URL Mappings)
router.post('/forgot-password', forgotPassword); // 1. Flutter app hits this to send email
router.get('/reset-password', renderResetPage);  // 2. User clicks email link to see webpage
router.post('/update-password', updatePassword); // 3. Webpage form submits new password here

// ---------------------------------------------------------
// 🔒 GUARD (Token Needed Below This Line)
router.use(auth);
// ---------------------------------------------------------

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