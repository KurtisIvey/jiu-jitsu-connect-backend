const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoDb = MongoMemoryServer;

const connect = async () => {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();  
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
};

const cleanData = async () => {
};

const disconnect = async () => {
    //await mongoose.connection.db.dropDatabase();

  await mongoose.disconnect();
  await mongoDb.stop();
};

module.exports = { connect, cleanData, disconnect };
