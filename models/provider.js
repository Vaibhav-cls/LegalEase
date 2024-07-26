const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");
const Review = require("./review.js");
const Tag = require("./tag.js");
const providerSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    min: 0,
  },
  location: {
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  incentive: {
    type: Schema.Types.ObjectId,
    ref: "Incentive",
  },
});

module.exports.mongoose.model("Provider", providerSchema);
