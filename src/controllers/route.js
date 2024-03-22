const { response } = require("express");
const { Route, Location } = require("../models");

const routeGet = async (req, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = {};

  const [total, routes] = await Promise.all([
    Route.countDocuments(query),
    Route.find(query).limit(Number(limit)).skip(Number(skip)),
  ]);

  res.json({
    total,
    routes,
  });
};

const routeGetOne = async (req, res = response) => {
  const { id } = req.params;

  const route = await Route.findById(id).populate("locations", "name");

  res.json({
    route,
  });
};

const routePost = async (req, res = response) => {
  const { name, locations } = req.body;
  const image = req.file.path;

  // check if the name exists
  const route = await Route.findOne({ name });
  if (route) {
    return res.status(400).json({
      msg: "Route already exists",
    });
  }

  const newRoute = new Route({ name, image, locations });

  await newRoute.save();

  res.json({
    newRoute,
  });
};

module.exports = {
  routeGet,
  routeGetOne,
  routePost,
};
