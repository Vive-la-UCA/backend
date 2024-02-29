const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } = process.env;

//const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
//console.log(url);
const url = `mongodb://mongo/vive_la_uca`;
const dbConnection = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to database");
  }
};

module.exports = {
  dbConnection,
};
