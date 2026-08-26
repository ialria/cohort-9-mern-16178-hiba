const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/", authMiddleware, getProfile);
router.put("/",authMiddleware,  express.json({ limit: "4mb" }),
  updateProfile);//4mb - might update image and then bio
module.exports = router;