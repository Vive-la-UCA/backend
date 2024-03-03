const { response } = require("express");
const { Location } = require("../models");

const locationGet = async (req, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = {};

  const [total, locations] = await Promise.all([
    Location.countDocuments(query),
    Location.find(query).limit(Number(limit)).skip(Number(skip)),
  ]);

  res.json({
    total,
    locations,
  });
};

const locationGetOne = async (req, res = response) => {
  const { id } = req.params;

  const location = await Location.findById(id);

  res.json({
    location,
  });
};

const locationPost = async (req, res = response) => {
  const { name, description, image, coordinates } = req.body;
  const location = new Location({ name, description, image, coordinates });

  await location.save();

  res.json({
    location,
  });
};

module.exports = {
  locationGet,
  locationGetOne,
  locationPost,
};
