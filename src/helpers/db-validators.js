const User = require("../models/user");

const emailExists = async (email = "") => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error(`The email ${email} already exists`);
  }
};

module.exports = {
  emailExists,
};
