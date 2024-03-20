const { Schema, model } = require("mongoose");

const LocationSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  latitude: {
    type: Number,
    required: [true, "Latitude is required"],
  },
  longitude: {
    type: Number,
    required: [true, "Longitude is required"],
  },
});

LocationSchema.methods.toJSON = function () {
  const { __v, _id, ...location } = this.toObject();
  location.uid = _id;
  return location;
};

module.exports = model("Location", LocationSchema);
