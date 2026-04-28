const mongoose = require("mongoose");
const { isRemoteOrPublicAsset } = require("../utils/assetPath");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    category: {
      type: String,
      required: true,
      enum: ["Lehenga", "Kurti", "Blouse", "Western Wear"],
    },
    desc: { type: String, default: "", maxlength: 1500 },
    img: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isRemoteOrPublicAsset,
        message: "Image must be a public asset path or absolute URL",
      },
    },
    emoji: { type: String, default: "*" },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

categorySchema.index({ isActive: 1, createdAt: -1 });
categorySchema.index({ category: 1 });

module.exports = mongoose.model("Category", categorySchema);
