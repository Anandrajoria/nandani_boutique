const mongoose = require("mongoose");
const { isRemoteOrPublicAsset } = require("../utils/assetPath");

const instagramPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    caption: { type: String, required: true, trim: true, maxlength: 2200 },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isRemoteOrPublicAsset,
        message: "Image must be a public asset path or absolute URL",
      },
    },
    instagramUrl: {
      type: String,
      required: true,
      trim: true,
      match: /^https:\/\/www\.instagram\.com\/.+/,
    },
    postedDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ["image", "video", "carousel"],
      default: "image",
    },
    isFeatured: { type: Boolean, default: false },
    containsPerson: { type: Boolean, default: false },
  },
  { timestamps: true },
);

instagramPostSchema.index({ postedDate: -1 });
instagramPostSchema.index({ isFeatured: 1, postedDate: -1 });
instagramPostSchema.index({ instagramUrl: 1 }, { unique: true });

module.exports = mongoose.model("InstagramPost", instagramPostSchema);
