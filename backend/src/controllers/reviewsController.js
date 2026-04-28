const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/Review");

const getReviews = asyncHandler(async (req, res) => {
  const data = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
  return res.json({ success: true, data, count: data.length });
});

const getAdminReviews = asyncHandler(async (req, res) => {
  const data = await Review.find({}).sort({ createdAt: -1 });
  return res.json({ success: true, data, count: data.length });
});

const createReview = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    isApproved: false,
  };

  if (!payload.avatar && payload.name) {
    payload.avatar = payload.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  const created = await Review.create(payload);
  return res.status(201).json({ success: true, data: created });
});

const updateReviewStatus = asyncHandler(async (req, res) => {
  const updated = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: req.body.isApproved },
    { returnDocument: "after", runValidators: true },
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  }

  return res.json({ success: true, data: updated });
});

const deleteReview = asyncHandler(async (req, res) => {
  const deleted = await Review.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  }
  return res.json({ success: true, message: "Review deleted" });
});

module.exports = {
  getReviews,
  getAdminReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
};
