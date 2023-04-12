const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post.model");
// middleware must be destructured otherwise error occurs
const { isLoggedIn } = require("../middleware/isLoggedIn");

let regex = /<>\$\/\|\[\]~`/;
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

exports.postsAll__get = [
  isLoggedIn,
  async (req, res) => {
    try {
      const posts = await Post.find({})
        .sort({ timestamp: -1 })
        .populate("author")
        .exec();
      //console.log(posts);
      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
  },
];

exports.postsByUser__get = [
  isLoggedIn,
  async (req, res) => {
    try {
      const posts = await Post.find({ author: req.params.id })
        .sort({ timestamp: -1 })
        .populate("author")
        .exec();
      if (posts.length >= 1) {
        return res.json({ posts });
      } else {
        return res.json({ posts: [] });
      }
    } catch (err) {
      console.log(err);
    }
  },
];

exports.specificPost__get = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author").exec();
    //console.log(post);
    if (post === null) {
      res.status(404).json({ status: "error", error: "post does not exist" });
    } else {
      res.json({ post });
    }
  } catch (err) {
    res.status(400).json({ status: "error", error: err });
  }
};

exports.like__put = [
  isLoggedIn,
  async (req, res) => {
    const userId = req.user.id;
    try {
      const post = await Post.findById(req.params.id).populate("author").exec();
      //console.log(post);
      if (post === null) {
        res.status(404).json({ status: "error", error: "post does not exist" });
      } else {
        //res.json({ post });
        if (post.likes.includes(userId)) {
          console.log("trying to remove");
          post.likes.pull(userId);
          await post.save();
          /* postLikeArr = [...post.likes];
          filteredPostLikeArr = postLikeArr.filter(
            (userId) => userId !== req.user._id
          );
          post.likes = filteredPostLikeArr;
          const updatedPost = await post.save(); */
          return res
            .status(201)
            .json({ status: "success", message: "post unliked" });
        }
        post.likes.push(userId);
        const newlyLikedPost = await post.save();
        return res.status(201).json({
          status: "success",
          message: "post liked",
          post: newlyLikedPost,
        });
      }
    } catch (err) {
      res.status(400).json({ status: "error", error: err });
    }
  },
];

exports.posts__post = [
  isLoggedIn,
  body("postContent").trim().blacklist(regex).notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.mapped() });
      return;
    }
    try {
      const post = new Post({
        postContent: req.body.postContent,
        author: req.user._id,
      });
      try {
        post.save();
        res
          .status(201)
          .json({ status: "ok", message: "post creation success", post });
      } catch (err) {
        res.status(400).json({ status: "error", err });
      }
    } catch (err) {
      res.json({ status: "error", error: err.message });
    }
  },
];
