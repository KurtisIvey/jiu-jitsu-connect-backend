const mongoose = require("mongoose");

async function connect() {
  const mongoDB = process.env.DB_URI;

  mongoose.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("mongodb connected")
  );
  mongoose.set("strictQuery", true);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
}

module.exports = connect;
