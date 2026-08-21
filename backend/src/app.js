const express = require("express");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoute");
const app = express();
app.use(cookieParser());
app.use(express.json());

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
app.use("/api/test", testRoutes);
module.exports = app;