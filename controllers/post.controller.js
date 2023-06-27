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

exports.posts__deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findOne({ _id: postId, author: userId });

    if (!post) {
      return res.status(404).json({
        status: "error",
        error: "Post not found or user is not the author",
      });
    }

    // Delete the post and comments for it if the _id of the comment is in
    // the post
    await Comment.deleteMany({ _id: { $in: post.comments } });
    await post.remove();

    return res.json({
      status: "success",
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ status: "error", error: err });
  }
};
