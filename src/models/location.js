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
  coordinates: {
    type: [Number],
    required: true,
  },
});

LocationSchema.index({ coordinates: "2dsphere" });

LocationSchema.methods.toJSON = function () {
  const { __v, _id, ...location } = this.toObject();
  location.uid = _id;
  return location;
};

module.exports = model("Location", LocationSchema);
