const express=require("express");
const {authLimiter} = require("../middleware/rateLimiter");
const {signup, login, logout, forgotPassword, resetPassword}=require("../controllers/authController");
const authLimiter = require("../middleware/authLimiter");
const router=express.Router();
router.post("/signup",signup);
router.post("/login",authLimiter,login);
router.post("/logout",logout);
router.post("/forgot-password", authLimiter,forgotPassword);
router.post("/reset-password", authLimiter,resetPassword);

module.exports=router;