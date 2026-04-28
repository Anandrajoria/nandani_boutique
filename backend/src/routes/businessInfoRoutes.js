const express = require("express");
const { body } = require("express-validator");
const {
  getBusinessInfo,
  upsertBusinessInfo,
} = require("../controllers/businessInfoController");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const businessValidation = [
  body("line1").isString().trim().notEmpty(),
  body("line2").isString().trim().notEmpty(),
  body("phone").isString().trim().isLength({ min: 10, max: 20 }),
  body("email").isEmail().normalizeEmail(),
  body("hours").isString().trim().isLength({ min: 1, max: 200 }),
  body("social.instagram")
    .optional({ values: "falsy" })
    .isURL({ protocols: ["https"], require_protocol: true })
    .matches(/^https:\/\/(www\.)?instagram\.com\/.+/iu),
];

router.get("/", getBusinessInfo);
router.put("/", requireAuth, businessValidation, validate, upsertBusinessInfo);

module.exports = router;
