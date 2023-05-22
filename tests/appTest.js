require("dotenv").config();
const express = require("express");
const app = express();
const initializeMongoServer = require("./testUtils/mongoConfigTesting");

initializeMongoServer();
// routes
const authRouter = require("../routes/auth.router.js");
const postRouter = require("../routes/post.router.js");
const userRouter = require("../routes/user.router.js");
const calendarRouter = require("../routes/calendar.router.js");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/calendar", calendarRouter);

module.exports = app;
