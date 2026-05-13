const asyncHandler = require("../utils/asyncHandler");
const BusinessInfo = require("../models/BusinessInfo");

const getBusinessInfo = asyncHandler(async (req, res) => {
  const data = await BusinessInfo.findOne({ key: "main" });
  if (!data) {
    return res
      .status(404)
      .json({ success: false, message: "Business info not found" });
  }
  return res.json({ success: true, data });
});

const upsertBusinessInfo = asyncHandler(async (req, res) => {
  const updated = await BusinessInfo.findOneAndUpdate(
    { key: "main" },
    { ...req.body, key: "main" },
    { returnDocument: "after", upsert: true, runValidators: true },
  );

  return res.json({ success: true, data: updated });
});

module.exports = { getBusinessInfo, upsertBusinessInfo };
