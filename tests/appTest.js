require("dotenv").config();
const express = require("express");
const app = express();
const initializeMongoServer = require("./testUtils/mongoConfigTesting");

initializeMongoServer();
// routes
const authRouter = require("../routes/auth.router.js");
const postRouter = require("../routes/post.router.js");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

module.exports = app;
