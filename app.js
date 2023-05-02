require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT;

// middlewares
app.use(express.json());
app.use(
  cors({
    // setting credentials true allows access-control header to true as well
    // absolute requirement, otherwise cors issues will follow
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,DELETE",

    origin: ["http://localhost:5173", "https://jiujitsu-connect.herokuapp.com"],
  })
);

// mongodb
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const mongoDB = process.env.DB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//routes
const authRouter = require("./routes/auth.router.js");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");

app.get("/", (req, res) => {
  res.send("deployed! :D");
});
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
