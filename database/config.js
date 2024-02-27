const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } =
  process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

const dbConnection = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to database");
  }
};

module.exports = {
  dbConnection,
};
