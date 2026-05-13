const express = require("express");
const { body, param, query } = require("express-validator");
const { isRemoteOrPublicAsset } = require("../utils/assetPath");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoriesController");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const categoryValidation = [
  body("name").isString().trim().isLength({ min: 1, max: 100 }),
  body("category").isIn(["Lehenga", "Kurti", "Blouse", "Western Wear"]),
  body("desc").optional().isString().isLength({ max: 1500 }),
  body("img").custom((value) => {
    if (!isRemoteOrPublicAsset(value)) {
      throw new Error("Image must be a public asset path or absolute URL");
    }
    return true;
  }),
];
const categoryIdValidation = [param("id").isMongoId()];

router.get(
  "/",
  [query("category").optional().isIn(["Lehenga", "Kurti", "Blouse", "Western Wear"])],
  validate,
  getCategories,
);
router.post("/", requireAuth, categoryValidation, validate, createCategory);
router.put(
  "/:id",
  requireAuth,
  categoryIdValidation,
  categoryValidation,
  validate,
  updateCategory,
);
router.delete("/:id", requireAuth, categoryIdValidation, validate, deleteCategory);

module.exports = router;
