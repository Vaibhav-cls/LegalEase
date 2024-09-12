const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const appointmentSchema = new Schema({
    date: {
      type: Date,
      min: "1987-09-28",
      max: "2025-05-23",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
    },
    status: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    confirmationStatus: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
module.exports = mongoose.model("Appointment", appointmentSchema);
