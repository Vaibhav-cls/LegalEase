const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  review: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Review", reviewSchema);
