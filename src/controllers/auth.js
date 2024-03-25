const { response } = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateJWT, googleVerify } = require("../helpers");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // check if the email exists
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        msg: "Check credentials",

      });
    }

    // check if password is correct
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Check credentials",
        
      });
    }

    // check if user is active
    if (!user.status) {
      return res.status(400).json({
        msg: "User is not active",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const loginGoogle = async (req, res = response) => {
  const id_token = req.token;

  try {
    const { name, email, picture } = await googleVerify(id_token);

    let user = await User.findOne({
      email,
    });

    // if user does not exist, create it
    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        image: picture,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    // if user exist in db check if is active
    if (!user.status) {
      return res.status(401).json({
        msg: "User is not active",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Google token is not valid",
    });
  }
};

const checkToken = async (req, res = response) => {
  const user = req.user;

  res.json({
    user,
  });
};

module.exports = {
  checkToken,
  login,
  loginGoogle,
};
