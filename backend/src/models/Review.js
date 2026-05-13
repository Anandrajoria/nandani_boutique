const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, trim: true, default: "India", maxlength: 120 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    avatar: { type: String, trim: true, maxlength: 2, default: "NA" },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model("Review", reviewSchema);
