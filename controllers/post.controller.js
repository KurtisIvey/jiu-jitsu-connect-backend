const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
// middleware must be destructured otherwise error occurs
const { isLoggedIn } = require("../middleware/isLoggedIn");

const regex = /<>\$\/\|\[\]~`/;

exports.postsAll__get = [
  isLoggedIn,
  async (req, res) => {
    try {
      const posts = await Post.find({})
        .sort({ timestamp: -1 })
        .populate("author")
        .exec();
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
    const post = await Post.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
      options: {
        sort: { timestamp: -1 },
      },
    });
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
      const post = await Post.findById(req.params.id);

      if (post.likes.includes(userId)) {
        post.likes.pull(userId);
        await post.save();
        return res
          .status(201)
          .json({ status: "success", message: "post unliked" });
      }
      post.likes.push(userId);
      await post.save();
      return res.status(201).json({
        status: "success",
        message: "post liked",
      });
    } catch (err) {
      res.status(400).json({ status: "error", error: err });
    }
  },
];

exports.postComment__put = [
  isLoggedIn,
  body("commentContent").trim().blacklist(regex).notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.mapped() });
      return;
    }
    try {
      const post = await Post.findById(req.params.id);
      if (post === null) {
        res.status(404).json({ status: "error", error: "post does not exist" });
      } else {
        const comment = new Comment({
          author: req.user._id,
          commentContent: req.body.commentContent,
        });

        comment.save();
        post.comments.push(comment);
        await post.save();

        return res.status(201).json({
          status: "success",
          message: "post commented",
          comment,
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

exports.specificPost__delete = [
  isLoggedIn,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log("req.user._id:", req.user._id);
      console.log("post.author:", post.author);
      console.log(req.user._id.equals(post.author));
      if (req.user._id.equals(post.author)) {
        await Comment.deleteMany({ _id: { $in: post.comments } });
        await Post.deleteOne({ _id: post._id });

        return res.status(202).json({
          status: "success",
          message: "Post deleted successfully",
        });
      } else {
        res
          .status(403)
          .json({
            status: "error",
            message: "permission denied, not the author of the post",
          });
      }
    } catch (err) {
      //console.error("Error deleting post:", err);
      return res.status(500).json({ status: "error", error: err });
    }
  },
];
