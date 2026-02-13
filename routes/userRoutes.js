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

router.post('/login', loginUser);
router.post('/register', registerUser);
// router.use(auth);
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