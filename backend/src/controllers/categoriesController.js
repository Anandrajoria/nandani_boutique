const asyncHandler = require("../utils/asyncHandler");
const Category = require("../models/Category");

const getCategories = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const list = await Category.find(filter).sort({
    displayOrder: 1,
    createdAt: -1,
  });
  res.json({ success: true, data: list, count: list.length });
});

const createCategory = asyncHandler(async (req, res) => {
  const created = await Category.create(req.body);
  res.status(201).json({ success: true, data: created });
});

const updateCategory = asyncHandler(async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }
  return res.json({ success: true, data: updated });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const deleted = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { returnDocument: "after" },
  );
  if (!deleted) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }
  return res.json({ success: true, message: "Category deleted" });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
