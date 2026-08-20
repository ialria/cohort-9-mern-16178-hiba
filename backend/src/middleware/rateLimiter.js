const rateLimit = require("express-rate-limit");

const authLimiter = (message)=>rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message
  },});
  const loginLimiter=authLimiter("Too many login attempts. Please try again later.")
  const forgotPasswordLimiter=authLimiter("Too many password reset attempts. Please try again later.")
  const resetPasswordLimiter=authLimiter("Too many password reset attempts. Please try again later.")
  const signupLimiter=authLimiter("Too many signup attempts. Please try again later.")
module.exports = {
    loginLimiter,forgotPasswordLimiter,resetPasswordLimiter,signupLimiter
};
