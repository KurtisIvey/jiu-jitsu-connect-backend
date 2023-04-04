const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post.model");
// middleware must be destructured otherwise error occurs
const { isLoggedIn } = require("../middleware/isLoggedIn");

/*
// post schema setup 
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  textContent: {
    type: String,
    required: true,
  },
 */

exports.posts__post = [
  isLoggedIn,
  body("postContent").trim().escape().notEmpty(),
  async (req, res) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const post = new Post({
        postContent: req.body.postContent,
        author: decoded._id,
      });
      try {
        post.save();
        res
          .status(201)
          .json({ status: "ok", message: "post creation success" });
      } catch (err) {
        res.status(400).json({ status: "error", err });
      }
    } catch (err) {
      res.json({ status: "error", error: err.message });
    }
  },
];

/* exports.post__post = [
    isLoggedIn,
    body("postContent").trim().escape().notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.mapped() });
        return;
      }
  
      try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const post = new Post({
          postContent: req.body.postContent,
          author: decoded._id,
        });
        try {
          post.save();
          res
            .status(201)
            .json({ status: "ok", message: "post creation success" });
        } catch (err) {
          res.status(400).json({ status: "error", err });
        }
      } catch (err) {
        res.json({ status: "error", error: err.message });
      }
    },
  ]; */
