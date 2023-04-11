const { isLoggedIn } = require("../middleware/isLoggedIn");
const User = require("../models/user.model");

exports.specificUser = [
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
