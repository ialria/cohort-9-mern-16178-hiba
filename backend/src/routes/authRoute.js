const express=require("express");
const {loginLimiter,forgotPasswordLimiter,resetPasswordLimiter,signupLimiter} = require("../middleware/rateLimiter");
const {signup, login, logout, forgotPassword, resetPassword}=require("../controllers/authController");
const authLimiter = require("../middleware/authLimiter");
const router=express.Router();
router.post("/signup",signupLimiter,signup);
router.post("/login",loginLimiter,login);
router.post("/logout",logout);
router.post("/forgot-password", forgotPasswordLimiter,forgotPassword);
router.post("/reset-password", resetPasswordLimiter,resetPassword);

module.exports=router;