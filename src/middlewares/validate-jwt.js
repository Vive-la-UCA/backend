const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const validateJWT = async (req = request, res = response, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      msg: "Token is required",
    });
  }

  // extract token from header
  const token = authHeader.split(" ")[1];

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    // Read user from database
    const user = await User.findById(uid);

    // check if user exists
    if (!user) {
      return res.status(404).json({
        msg: "Cannot find user",
      });
    }

    // check if user is active
    if (!user.status) {
      return res.status(401).json({
        msg: "User is not active",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = {
  validateJWT,
};
