const express = require("express");
const { body, param, query } = require("express-validator");
const { isRemoteOrPublicAsset } = require("../utils/assetPath");
const {
  getInstagramPosts,
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
} = require("../controllers/instagramController");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const instagramValidation = [
  body("title").isString().trim().isLength({ min: 3, max: 120 }),
  body("caption").isString().trim().isLength({ min: 5, max: 2200 }),
  body("imageUrl").custom((value) => {
    if (!isRemoteOrPublicAsset(value)) {
      throw new Error("Image must be a public asset path or absolute URL");
    }
    return true;
  }),
  body("instagramUrl")
    .isURL({ protocols: ["https"], require_protocol: true })
    .matches(/^https:\/\/www\.instagram\.com\/.+/),
  body("postedDate").isISO8601(),
  body("type").optional().isIn(["image", "video", "carousel"]),
  body("isFeatured").optional().isBoolean(),
  body("containsPerson").optional().isBoolean(),
];
const instagramIdValidation = [param("id").isMongoId()];

router.get(
  "/",
  [
    query("featured").optional().isBoolean().toBoolean(),
    query("limit").optional().isInt({ min: 1, max: 12 }).toInt(),
  ],
  validate,
  getInstagramPosts,
);
router.post(
  "/",
  requireAuth,
  instagramValidation,
  validate,
  createInstagramPost,
);
router.put(
  "/:id",
  requireAuth,
  instagramIdValidation,
  instagramValidation,
  validate,
  updateInstagramPost,
);
router.delete("/:id", requireAuth, instagramIdValidation, validate, deleteInstagramPost);

module.exports = router;
