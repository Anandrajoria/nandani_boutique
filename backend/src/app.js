const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const env = require("./config/env");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const businessInfoRoutes = require("./routes/businessInfoRoutes");
const instagramRoutes = require("./routes/instagramRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const uploadsRoutes = require("./routes/uploadsRoutes");

const app = express();

app.set("trust proxy", env.trustProxy);
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("CORS origin not allowed");
      error.statusCode = 403;
      return callback(error);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "4mb" }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    index: false,
    maxAge: "7d",
  }),
);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/business-info", businessInfoRoutes);
app.use("/api/instagram-posts", instagramRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/uploads", uploadsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
