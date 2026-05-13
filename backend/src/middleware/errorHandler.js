const env = require("../config/env");

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: "Route not found" });
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message =
    status >= 500 && env.nodeEnv !== "development"
      ? "Internal server error"
      : err.message || "Internal server error";

  if (res.headersSent) {
    return next(err);
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = { notFoundHandler, errorHandler };
