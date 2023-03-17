const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// test route to ensure auth router is functioning properly
router.get("/test", (req, res) => {
  res.status(200).json({ test: "auth router working" });
});

//register
router.post("/register", authController.register__post);

//login
router.post("/login", authController.login__post);

module.exports = router;
