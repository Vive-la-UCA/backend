const mongoose = require("mongoose");
require("dotenv").config();

//const url = `mongodb://mongo/vive_la_uca`;
const url = "mongodb://localhost:27017/openhouse"


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
