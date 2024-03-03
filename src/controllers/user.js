const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const { User } = require("../models");

const usersGet = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(Number(limit)).skip(Number(skip)),
  ]);

  res.json({
    total,
    users,
  });
};

const usersGetOne = async (req, res = response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  res.json({
    user,
  });
};

const usersPost = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  // Encrypt password
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  // Save in database
  await user.save();

  res.json({
    user,
  });
};

module.exports = {
  usersPost,
  usersGetOne,
  usersGet,
};
