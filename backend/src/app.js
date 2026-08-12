const express = require("express");
const cors=require("cors");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoute");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
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