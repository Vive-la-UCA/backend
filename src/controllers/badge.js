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
  // Multer middleware has already handled file upload, so the filename is available in req.file.filename
  const { name, route } = req.body;
  const image = req.file.path; // Get the filename of the uploaded image

  // Check if the name exists
  const badge = await Badge.findOne({ name });
  if (badge) {
    return res.status(400).json({
      msg: "Badge already exists",
    });
  }

  // Check if the route exists
  const routeExists = await Route.findById(route);
  if (!routeExists) {
    return res.status(400).json({
      msg: "Route does not exist",
    });
  }
  
  try {
    // Create new badge with image filename and route ID
    const newBadge = new Badge({ name, image, route });
    await newBadge.save();

    res.json({
      newBadge,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
  badgeGet,
  badgeGetOne,
  badgePost,
};
