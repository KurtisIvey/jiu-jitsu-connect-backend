const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.isLoggedIn = async (req, res, next) => {
  // custom middleware that verifies property set manually in the db to authorize access
  try {
    const token = req.headers.authorization;
    const decodedJwt = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: decodedJwt._id });

    // if user doesn't exist in db
    if (!user) {
      res.status(401).json({
        status: "error",
        error: "unauthorized access",
      });
    }
    // bind decoded jwt to req.user
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "error",
      error: "unauthorized access",
      message: err.message,
    });
  }
};
