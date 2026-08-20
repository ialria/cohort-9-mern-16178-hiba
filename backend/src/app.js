const express = require("express");
const logger = require("./utilities/logger");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoute");
const noteRoutes=require("./routes/noteRoute");
const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
  })
);
app.get("/", (req, res) => {
  res.json({
    message: "Leaflet Notes API is running",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

app.use((error,req, res, next) => {
  logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
      },
    },
    "Unexpected server error",
  );
  return res.status(500).json({
    message: "Something went wrong",
  });
});
module.exports = app;