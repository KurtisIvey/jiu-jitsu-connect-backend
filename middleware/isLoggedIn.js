const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.isLoggedIn = async (req, res, next) => {
  // custom middleware that verifies property set manually in the db to authorize access
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        status: "error",
        error: "unauthorized access",
        message: "No token provided",
      });
    }

    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        error: "unauthorized access",
        message: "Invalid token format",
      });
    }

    const jwtToken = token.substring(7, token.length);
    const decodedJwt = jwt.verify(jwtToken, process.env.SECRET);
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
    req.token = jwtToken;
    next();
  } catch (err) {
    //console.log(err);
    res.status(401).json({
      status: "error",
      error: "unauthorized access",
      message: err.message,
    });
  }
};
