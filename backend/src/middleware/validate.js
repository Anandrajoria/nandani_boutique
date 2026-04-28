const { matchedData, validationResult } = require("express-validator");

function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.array(),
    });
  }

  if (req.body && typeof req.body === "object") {
    req.body = matchedData(req, {
      includeOptionals: true,
      locations: ["body"],
    });
  }

  if (req.params && typeof req.params === "object") {
    const params = matchedData(req, {
      includeOptionals: true,
      locations: ["params"],
    });
    if (Object.keys(params).length > 0) {
      req.params = params;
    }
  }

  if (req.query && typeof req.query === "object") {
    const query = matchedData(req, {
      includeOptionals: true,
      locations: ["query"],
    });
    if (Object.keys(query).length > 0) {
      req.query = query;
    }
  }

  return next();
}

module.exports = validate;
