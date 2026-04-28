const dotenv = require("dotenv");

dotenv.config();

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseOrigins(value) {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function parseTrustProxy(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized || normalized === "false" || normalized === "0" || normalized === "off") {
    return false;
  }

  if (normalized === "true" || normalized === "1" || normalized === "on") {
    return 1;
  }

  const numeric = Number.parseInt(normalized, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : false;
}

function isPlaceholder(value = "") {
  return /replace-with|change-me|example|your-/iu.test(value);
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parsePositiveInt(process.env.PORT, 3000),
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nandani_boutique_dev",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  adminEmail: (process.env.ADMIN_EMAIL || "admin@nandani.local")
    .toLowerCase()
    .trim(),
  adminPassword: process.env.ADMIN_PASSWORD || "",
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN || "http://localhost:5173"),
  authRateLimitWindowMs: parsePositiveInt(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  ),
  authRateLimitMax: parsePositiveInt(process.env.AUTH_RATE_LIMIT_MAX, 8),
  publicRateLimitWindowMs: parsePositiveInt(
    process.env.PUBLIC_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  ),
  publicRateLimitMax: parsePositiveInt(process.env.PUBLIC_RATE_LIMIT_MAX, 10),
  uploadRateLimitWindowMs: parsePositiveInt(
    process.env.UPLOAD_RATE_LIMIT_WINDOW_MS,
    10 * 60 * 1000,
  ),
  uploadRateLimitMax: parsePositiveInt(process.env.UPLOAD_RATE_LIMIT_MAX, 20),
};

if (!env.mongoUri) {
  throw new Error("MONGODB_URI is required.");
}

if (!env.jwtSecret || isPlaceholder(env.jwtSecret) || env.jwtSecret.length < 24) {
  throw new Error("JWT_SECRET must be set to a strong secret in backend/.env.");
}

if (
  !env.adminPassword ||
  isPlaceholder(env.adminPassword) ||
  env.adminPassword.length < 12
) {
  throw new Error(
    "ADMIN_PASSWORD must be set to a strong password in backend/.env.",
  );
}

module.exports = env;
