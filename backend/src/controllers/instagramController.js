const asyncHandler = require("../utils/asyncHandler");
const InstagramPost = require("../models/InstagramPost");

const getInstagramPosts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.featured === true) {
    filter.isFeatured = true;
  }

  const query = InstagramPost.find(filter).sort({ postedDate: -1 });
  if (req.query.limit) {
    query.limit(req.query.limit);
  }
  const posts = await query;

  return res.json({ success: true, data: posts, count: posts.length });
});

const createInstagramPost = asyncHandler(async (req, res) => {
  const created = await InstagramPost.create(req.body);
  return res.status(201).json({ success: true, data: created });
});

const updateInstagramPost = asyncHandler(async (req, res) => {
  const updated = await InstagramPost.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Instagram post not found" });
  }
  return res.json({ success: true, data: updated });
});

const deleteInstagramPost = asyncHandler(async (req, res) => {
  const deleted = await InstagramPost.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res
      .status(404)
      .json({ success: false, message: "Instagram post not found" });
  }
  return res.json({ success: true, message: "Instagram post deleted" });
});

module.exports = {
  getInstagramPosts,
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
};
