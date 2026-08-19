const express=require("express");
const {loginLimiter,forgotPasswordLimiter,resetPasswordLimiter,signupLimiter} = require("../middleware/rateLimiter");
<<<<<<< HEAD
const {signup, login, logout, forgotPassword, resetPassword,getCurrentUser}=require("../controllers/authController");
const router=express.Router();
const authMiddleware=require("../middleware/authMiddleware");
=======
const {signup, login, logout, forgotPassword, resetPassword}=require("../controllers/authController");

const router=express.Router();
router.post("/signup",signupLimitersignup);
router.post("/login",loginLimiter,login);
router.post("/logout",logout);
router.post("/forgot-password", forgotPasswordLimiter,forgotPassword);
router.post("/reset-password", resetPasswordLimiter,resetPassword);
>>>>>>> 3888dbb (Resolved PR review comments)

router.post("/signup",signupLimiter,signup);
router.post("/login",loginLimiter,login);
router.post("/logout",logout);
router.post("/forgot-password", forgotPasswordLimiter,forgotPassword);
router.post("/reset-password", resetPasswordLimiter,resetPassword);
router.get("/me", authMiddleware, getCurrentUser);
module.exports=router;