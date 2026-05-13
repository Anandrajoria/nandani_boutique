const jwt = require("jsonwebtoken");
const env = require("../config/env");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (!payload?.sub || payload.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    req.user = payload;
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
