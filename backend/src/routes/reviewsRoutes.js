const express = require("express");
const { body, param } = require("express-validator");
const {
  getReviews,
  getAdminReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewsController");
const { requireAuth } = require("../middleware/auth");
const { createRateLimiter } = require("../middleware/rateLimit");
const env = require("../config/env");
const validate = require("../middleware/validate");

const router = express.Router();
const publicRateLimit = createRateLimiter({
  keyPrefix: "public-review",
  windowMs: env.publicRateLimitWindowMs,
  max: env.publicRateLimitMax,
  message: "Too many review submissions. Please try again later.",
});

const reviewValidation = [
  body("name").isString().trim().isLength({ min: 1, max: 100 }),
  body("location").optional().isString().trim().isLength({ max: 120 }),
  body("rating").isInt({ min: 1, max: 5 }),
  body("text").isString().trim().isLength({ min: 10, max: 1000 }),
];
const reviewIdValidation = [param("id").isMongoId()];

router.get("/", getReviews);
router.get("/admin", requireAuth, getAdminReviews);
router.post("/", publicRateLimit, reviewValidation, validate, createReview);
router.patch(
  "/:id/status",
  requireAuth,
  reviewIdValidation,
  [body("isApproved").isBoolean()],
  validate,
  updateReviewStatus,
);
router.delete("/:id", requireAuth, reviewIdValidation, validate, deleteReview);

module.exports = router;
