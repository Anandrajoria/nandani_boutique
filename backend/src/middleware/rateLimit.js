const buckets = new Map();

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function cleanupExpiredBuckets() {
  const now = Date.now();
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

const cleanupTimer = setInterval(cleanupExpiredBuckets, 60 * 1000);
cleanupTimer.unref();

function createRateLimiter({
  keyPrefix,
  windowMs,
  max,
  message = "Too many requests. Please try again later.",
}) {
  return function rateLimit(req, res, next) {
    const now = Date.now();
    const key = `${keyPrefix}:${getClientKey(req)}`;
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    existing.count += 1;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000),
    );

    res.set("Retry-After", String(retryAfterSeconds));

    if (existing.count > max) {
      return res.status(429).json({ success: false, message });
    }

    return next();
  };
}

module.exports = { createRateLimiter };
