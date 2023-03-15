require("dotenv").config();
const express = require("express");
const app = express();
require("./utilities/mongoConfig");
const port = process.env.PORT || 3001;

// middlewares
app.use(express.json());

// mongodb
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const mongoDB = process.env.DB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
