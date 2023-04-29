const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/test", (req, res) => {
  res.status(200).json({ test: "user router working" });
}); // friend request

router.get("/:id", userController.specificUser__get);
router.put("/:id/friend-request", userController.FriendRequest__put);
router.put(
  "/:id/friend-request-handler",
  userController.FriendRequestResponse__put
);
router.put("/:id/friends", userController.removeFriend__put);
router.put(
  "/account-settings",
  upload.single("image"),
  userController.accountSettings__put
);

// update username/profilepicurl
module.exports = router;
