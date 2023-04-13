const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller.js");
// test route to ensure post router is functioning properly
router.get("/test", (req, res) => {
  res.status(200).json({ test: "post router working" });
});

//get posts
router.get("/", postController.postsAll__get);
router.get("/:id", postController.specificPost__get);
router.get("/byUserId/:id", postController.postsByUser__get);
router.post("/", postController.posts__post);

router.put("/:id/like", postController.like__put);

router.put("/:id/comment", postController.postComment__put);
//login

module.exports = router;
