const express = require("express");
const { body } = require("express-validator");
const { login, logout, verify } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { createRateLimiter } = require("../middleware/rateLimit");
const env = require("../config/env");
const validate = require("../middleware/validate");

const router = express.Router();
const authRateLimit = createRateLimiter({
  keyPrefix: "auth-login",
  windowMs: env.authRateLimitWindowMs,
  max: env.authRateLimitMax,
  message: "Too many login attempts. Please try again later.",
});

router.post(
  "/login",
  authRateLimit,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6, max: 200 }),
  ],
  validate,
  login,
);
router.post("/logout", requireAuth, logout);
router.get("/verify", requireAuth, verify);

module.exports = router;
