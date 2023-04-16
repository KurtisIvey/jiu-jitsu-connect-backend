const { isLoggedIn } = require("../middleware/isLoggedIn");
const User = require("../models/user.model");

exports.specificUser__get = [
  isLoggedIn,
  async (req, res) => {
    try {
      // withhold password being returned for security
      const user = await User.findById(req.params.id, {
        _id: 1,
        username: 1,
        friends: 1,
        friendRequests: 1,
        profilePicUrl: 1,
      });

      if (user === null) {
        res.status(404).json({ status: "error", error: "unable to find user" });
      } else {
        res.json({ user });
      }
    } catch (err) {
      res.status(400).json({ status: "error", error: err });
    }
  },
];

exports.sendFriendRequest__put = [
  isLoggedIn,
  async (req, res) => {
    try {
      const currentUser = req.user._id;

      const userToBefriend = await User.findById(req.params.id);
      if (userToBefriend === null) {
        res.status(404).json({ status: "error", error: "user does not exist" });
      }
      if (userToBefriend._id === currentUser) {
        res.status(400).json({ status: "error", error: "already friends" });
      } else {
        userToBefriend.friendRequests.push(currentUser);
        await userToBefriend.save();
        return res.status(201).json({
          status: "success",
          message: "friendship requested",
          userToBefriend,
        });
      }
    } catch (err) {
      res.status(400).json({ status: "error", error: err });
    }
  },
];

exports.FriendRequestDeny__delete = [
  isLoggedIn,
  async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const user = await User.findById(userId);
      const friendIndex = user.friendRequests.indexOf(friendId);
      if (friendIndex !== -1) {
        user.friendRequests.splice(friendIndex, 1);
        await user.save();
        res.status(200).json({ message: "Friend request denied" });
      } else {
        res.status(404).json({ message: "Friend request not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
