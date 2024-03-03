const { Schema, model } = require("mongoose");

const RouteSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  locations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required"],
    },
  ],
});

RouteSchema.methods.toJSON = function () {
  const { __v, _id, ...route } = this.toObject();
  route.uid = _id;
  return route;
};

module.exports = model("Route", RouteSchema);
