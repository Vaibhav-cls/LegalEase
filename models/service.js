const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const serviceSchema = new Schema({
  service_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  providers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
  ],
});

module.exports.mongoose.model("Service", serviceSchema);
