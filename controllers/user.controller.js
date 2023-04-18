const { isLoggedIn } = require("../middleware/isLoggedIn");
const User = require("../models/user.model");

exports.specificUser__get = [
  isLoggedIn,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("_id username friends friendRequests profilePicUrl")
        .populate("friendRequests");

      if (!user) {
        return res
          .status(404)
          .json({ status: "error", error: "Unable to find user" });
      }

      res.json({ user });
    } catch (error) {
      res.status(400).json({ status: "error", error });
    }
  },
];

/*
allows friend request to be sent and retracted by person requesting friendship
*/
exports.FriendRequest__put = [
  isLoggedIn,
  async (req, res) => {
    try {
      const currentUser = req.user._id;
      const userToBefriend = await User.findById(req.params.id);

      if (!userToBefriend) {
        return res.status(404).json({
          status: "error",
          error: "User does not exist",
        });
      }
      // stops friend requesting yourself
      if (currentUser.equals(userToBefriend._id)) {
        return res.status(400).json({
          status: "error",
          error: "You can't be friends with yourself",
        });
      }
      // retract friend request
      if (userToBefriend.friendRequests.includes(currentUser)) {
        await userToBefriend.updateOne({
          $pull: { friendRequests: currentUser },
        });
        return res.status(201).json({
          status: "success",
          message: "Friendship unrequested",
        });
      }
      // if not currently friends, sends request
      await userToBefriend.updateOne({
        $push: { friendRequests: currentUser },
      });

      return res.status(201).json({
        status: "success",
        message: "Friendship requested",
        userToBefriend,
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        error: err.message,
      });
    }
  },
];

exports.FriendRequestDeny__put = [
  isLoggedIn,
  async (req, res) => {
    try {
      const requesteeId = req.body.requester;
      const user = await User.findById(req.user._id);
      if (user.friendRequests.includes(requesteeId)) {
        await user.updateOne({
          $pull: { friendRequests: requesteeId },
        });
        return res.status(201).json({
          status: "success",
          message: `Friendship request Denied for ${requesteeId}`,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
