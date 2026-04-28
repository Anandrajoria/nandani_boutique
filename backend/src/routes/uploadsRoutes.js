const express = require("express");
const { body } = require("express-validator");
const { uploadImage } = require("../controllers/uploadsController");
const { requireAuth } = require("../middleware/auth");
const { createRateLimiter } = require("../middleware/rateLimit");
const env = require("../config/env");
const validate = require("../middleware/validate");

const router = express.Router();
const uploadRateLimit = createRateLimiter({
  keyPrefix: "admin-upload",
  windowMs: env.uploadRateLimitWindowMs,
  max: env.uploadRateLimitMax,
  message: "Too many uploads. Please wait before trying again.",
});

router.post(
  "/image",
  requireAuth,
  uploadRateLimit,
  [
    body("dataUrl").isString().trim().notEmpty(),
    body("folder").optional().isIn(["collections", "instagram", "general"]),
    body("fileName").optional().isString().trim().isLength({ max: 120 }),
  ],
  validate,
  uploadImage,
);

module.exports = router;
