const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incentiveSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  incentive_type: {
    type: String,
    enum: ["bonus", "reward", "badge"],
    required: true,
  },
  description: String,
  providers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
  ],
});
