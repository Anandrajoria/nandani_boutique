const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");
const AdminUser = require("../models/AdminUser");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || "").toLowerCase().trim();
  const user = await AdminUser.findOne({ email: normalizedEmail });

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  res.set("Cache-Control", "no-store");
  return res.json({ success: true, token });
});

const verify = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.json({ success: true, user: req.user });
});

const logout = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.json({ success: true, message: "Logged out" });
});

module.exports = { login, verify, logout };
