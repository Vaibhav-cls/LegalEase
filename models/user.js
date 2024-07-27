const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      url: String,
      filename: String,
    },
    phone_number: {
      type: Number,
      required: true,
      unique: true,
    },
    user_type: {
      type: String,
      enum: ["admin", "client", "provider"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
