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
  const { name, description, latitude, longitude } = req.body;
  const image = req.file.path;

  const location = new Location({
    name,
    description,
    image,
    latitude,
    longitude,
  });

  await location.save();

  res.json({
    location,
  });
};
      
const locationPut = async (req, res = response) => {
  const { id } = req.params;
}

module.exports = {
  locationGet,
  locationGetOne,
  locationPost,
};
