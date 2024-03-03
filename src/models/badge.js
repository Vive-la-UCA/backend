const { Schema, model } = require("mongoose");

const BadgeSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
  },
  route: {
    type: Schema.Types.ObjectId,
    ref: "Route",
  },
});

BadgeSchema.methods.toJSON = function () {
  const { __v, _id, ...badge } = this.toObject();
  badge.uid = _id;
  return badge;
};

module.exports = model("Badge", BadgeSchema);
