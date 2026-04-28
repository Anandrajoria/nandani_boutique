const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");

const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");
const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024;
const MIME_EXTENSION_MAP = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function parseDataUrl(dataUrl) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/u.exec(
    dataUrl || "",
  );

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function sanitizeFileName(value = "upload") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function isSupportedImageBuffer(mimeType, buffer) {
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8;
  }

  if (mimeType === "image/png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  }

  if (mimeType === "image/webp") {
    return (
      buffer.subarray(0, 4).equals(Buffer.from("RIFF")) &&
      buffer.subarray(8, 12).equals(Buffer.from("WEBP"))
    );
  }

  return false;
}

const uploadImage = asyncHandler(async (req, res) => {
  const parsed = parseDataUrl(req.body.dataUrl);

  if (!parsed) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid image data" });
  }

  if (!parsed.buffer.length || parsed.buffer.length > MAX_UPLOAD_SIZE_BYTES) {
    return res.status(400).json({
      success: false,
      message: "Image is too large. Maximum size is 2 MB.",
    });
  }

  if (!isSupportedImageBuffer(parsed.mimeType, parsed.buffer)) {
    return res.status(400).json({
      success: false,
      message: "Uploaded file content does not match the image type.",
    });
  }

  const folder = req.body.folder || "general";
  const extension = MIME_EXTENSION_MAP[parsed.mimeType];
  const name = sanitizeFileName(req.body.fileName || "upload");
  const fileName = `${Date.now()}-${name || "image"}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  const destinationDir = path.join(UPLOAD_ROOT, folder);
  const destinationFile = path.join(destinationDir, fileName);

  await fs.mkdir(destinationDir, { recursive: true });
  await fs.writeFile(destinationFile, parsed.buffer);

  const relativePath = `/uploads/${folder}/${fileName}`;
  const absoluteUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

  return res.status(201).json({
    success: true,
    data: {
      path: relativePath,
      url: absoluteUrl,
    },
  });
});

module.exports = { uploadImage };
