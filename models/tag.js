const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Provider = require("./provider.js");
const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  providers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: false,
    },
  ],
});

module.exports.mongoose.model("Tag", tagSchema);
