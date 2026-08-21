const express = require("express");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoute");
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

module.exports = app;