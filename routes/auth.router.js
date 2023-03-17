const express = require("express");
const router = express.Router();

// test route to ensure auth router is functioning properly
router.get("/test", (req, res) => {
  res.status(200).json({ test: "auth router working" });
});

//register

//login

module.exports = router;
