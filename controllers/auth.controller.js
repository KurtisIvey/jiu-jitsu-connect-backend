const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userErrorHandler = require("../utilities/error_handler");

exports.register__post = [
  body("username").notEmpty().trim().escape().isLength({ min: 3 }),
  body("email").notEmpty().trim().isEmail().escape(),
  body("password").notEmpty().trim().escape(),
  async (req, res) => {
    // errors detected via express-validator in the sanitization and escaping prior
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.mapped() });
      return;
    }
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    try {
      user.save();
      res.status(201).json({ status: "ok", message: "successful creation" });
    } catch (err) {
      const errors = userErrorHandler(err);
      res.status(400).json({ status: "error", errors });
    }
  },
];

exports.login__post = [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);

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
        // 3 hour expire
        { expiresIn: 60 * 60 * 3 }
      );
      // heroku eco plan doesn't allow me to set cookies, so jwt stored via local storage and passed via client header
      return res.status(200).json({
        status: "ok",
        token,
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
      });
    } catch (err) {
      const errors = userErrorHandler(err);
      return res.status(400).json({ status: "error", errors });
    }
  },
];
