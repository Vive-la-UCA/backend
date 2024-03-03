const { response } = require("express");
const { Badge, Route } = require("../models");

const badgeGet = async (req, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = {};

  const [total, badges] = await Promise.all([
    Badge.countDocuments(query),
    Badge.find(query).limit(Number(limit)).skip(Number(skip)),
  ]);

  res.json({
    total,
    badges,
  });
};

const badgeGetOne = async (req, res = response) => {
  const { id } = req.params;

  const badge = await Badge.findById(id).populate("route", "name");

  res.json({
    badge,
  });
};

const badgePost = async (req, res = response) => {
  const { name, image, route } = req.body;

  // check if the name exists
  const badge = await Badge.findOne({ name });
  if (badge) {
    return res.status(400).json({
      msg: "Badge already exists",
    });
  }

  // check if the route exists
  const routeExists = await Route.findById(route);
  if (!routeExists) {
    return res.status(400).json({
      msg: "Route does not exist",
    });
  }

  const newBadge = new Badge({ name, image, route });
  await newBadge.save();

  res.json({
    newBadge,
  });
};

module.exports = {
  badgeGet,
  badgeGetOne,
  badgePost,
};
