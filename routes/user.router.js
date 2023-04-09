const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/test", (req, res) => {
  res.status(200).json({ test: "user router working" });
}); // friend request

router.get("/:id", userController.specificUser);
// update username/profilepicurl
module.exports = router;
