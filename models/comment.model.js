const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  commentContent: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
