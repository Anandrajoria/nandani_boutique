const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  mongoose.set("strictQuery", true);
  mongoose.set("sanitizeFilter", true);
  await mongoose.connect(env.mongoUri, {
    maxPoolSize: 20,
    minPoolSize: 5,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
  });
}

module.exports = { connectDB, mongoose };
