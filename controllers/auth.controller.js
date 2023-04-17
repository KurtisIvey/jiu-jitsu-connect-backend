const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const userErrorHandler = require("../utilities/error_handler");

exports.register__post = [
  body("username").notEmpty().trim().escape().isLength({ min: 3 }),
  body("email").notEmpty().trim().isEmail().escape(),
  body("password").notEmpty().trim().escape(),
  async (req, res) => {
    // errors detected via express-validator in the sanitization and escaping prior
    const errors = validationResult(req);
    //console.log("reach 2");

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.mapped() });
      return;
    }
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    try {
      await user.save();
      res.status(201).json({ status: "ok", message: "successful creation" });
    } catch (err) {
      const errors = userErrorHandler(err);
      res.status(400).json({ status: "error", errors, err: err });
    }
  },
];

exports.login__post = [
  body("email").trim().isEmail().notEmpty().normalizeEmail(),
  body("password").trim().notEmpty().escape(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
      const user = await User.login(email, password);
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 60 }
      );
      return res.json({
        status: "ok",
        token,
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
          profilePicUrl: user.profilePicUrl,
          friends: user.friends,
          friendRequests: user.friendRequests,
        },
      });
    } catch (err) {
      //const errors = userErrorHandler(err);
      //console.log("reach error");
      return res.status(400).json({ status: "error", errors: err });
    }
  },
];

// logout handle on client via token removal from local storage.
