const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendar.controller");

// Test route to ensure calendar router is functioning properly
router.get("/test", (req, res) => {
  res.status(200).json({ test: "calendar router working" });
});

// Get calendar schedule
router.get("/", calendarController.calendar__get);
router.get("/specific-date-range", calendarController.calendarRange__post);

// Add to calendar schedule
router.post("/", calendarController.calendar__post);

// Delete date on calendar schedule
router.delete("/", calendarController.calendar__delete);

module.exports = router;
