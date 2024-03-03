const User = require("../models/user");

const emailExists = async (email = "") => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error(`The email ${email} already exists`);
  }
};

const routeExistsById = async (id = "") => {
  const exists = await Route.findById(id);

  if (!exists) {
    throw new Error(`The route with id ${id} does not exist`);
  }
};

module.exports = {
  emailExists,
  routeExistsById,
};
