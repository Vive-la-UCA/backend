const { response } = require("express");

const testGet = (req, res = response) => {
  res.json({
    msg: "GET API - Controller",
  });
};

module.exports = {
  testGet,
};
