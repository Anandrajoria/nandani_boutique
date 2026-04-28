const mongoose = require("mongoose");

const businessInfoSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^\+?[0-9\s-]{10,20}$/,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /.+@.+\..+/,
    },
    hours: { type: String, required: true, trim: true, maxlength: 200 },
    social: {
      instagram: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BusinessInfo", businessInfoSchema);
