const express=require("express");
const {loginLimiter,forgotPasswordLimiter,resetPasswordLimiter,signupLimiter} = require("../middleware/rateLimiter");
const {signup, login, logout, forgotPassword, resetPassword}=require("../controllers/authController");
const router=express.Router();
router.post("/signup",signupLimiter,signup);
router.post("/login",authLimiter,login);
router.post("/logout",logout);
router.post("/forgot-password", authLimiter,forgotPassword);
router.post("/reset-password", authLimiter,resetPassword);

module.exports=router;