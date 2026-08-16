import { useState } from "react";
import { Eye, EyeOff , Lock, Check} from "../../icons/icons.jsx";
import LeafletLogo from "../../icons/leaflet_logo.jsx";
import Button from "../../components/Button.jsx";
import zxcvbn from "../../utils/passwordStrength.js";
import PasswordStrength from "../../components/PasswordStrength.jsx";
import { useSearchParams,useNavigate } from "react-router-dom";
import { apiFetch } from "../../config/api.js";

function ResetPassword(){
    const [isSubmitting, setIsSubmitting] = useState(false);
const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
    const [resetSuccessful, setResetSuccessful] = useState(false);
const token = searchParams.get("token");
const navigate=useNavigate();
     function validateForm() {
    const newErrors = {};

  if (password.trim() === "") {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (password.length > 64) {
      newErrors.password = "Password must be 64 characters or less.";
    }
    if (confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validateForm();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);

      return;
    }
    if (!token) {
    setErrors({
      form: "Invalid or missing reset link.",
    });
    return;
  }

setErrors({});
setIsSubmitting(true);
  try {
    const response = await apiFetch(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setErrors({
        form: data.message || "Unable to reset password.",
      });
      return;
    }

    setResetSuccessful(true);

  } catch (error) {
    console.error("Reset password error:", error);

    setErrors({
      form: "Something went wrong. Please try again.",
    });
  }finally{
    setIsSubmitting(false);
  }
   
}
  return <div className="min-h-screen w-full flex flex-col md:flex-row">
        <div className="bg-primary w-full md:w-1/2 h-auto hidden md:block md:h-screen  py-6 px-6 sm:px-8 md:px-10 lg:px-18 md:py-12 md:sticky top-0">
      <div className="flex items-center gap-2">
        <LeafletLogo className="w-8 h-8 md:w-10 md:h-10  text-surface" />
        <p className="text-background">leaflet</p>
      </div>

      <div className="max-w-md md:block mt-10 md:mt-23  mr-2 md:mr-2 lg:mr-12 lg:mt-24 xl:mt-32">
        <p className="text-background text-2xl md:text-3xl lg:text-4xl font-semibold">One more step and you're back in.</p>
     

        <p className="text-text-muted  mt-6 lg:mt-10 text-sm leading-7">
         Pick something you'll actually remember this time.
        </p>
      </div>
    </div>
    {resetSuccessful ? (
  <div className="flex flex-col items-center text-center px-8 py-8 mt-6 h-screen ">

    <div className="bg-primary-light w-26 h-26 rounded-full flex justify-center items-center">
        <div className="bg-primary w-18 h-18 rounded-full flex justify-center items-center">
      <Check size={40} className="text-surface" />

    </div>
    </div>

    <h2 className="text-text/80 font-semibold text-3xl mt-6">
      Password reset successfully
    </h2>

    <p className="text-text-muted text-sm mt-3">
      Your password has been changed successfully.
      You can now log in with your new password.
    </p>

    <Button
      type="button"
     
      onClick={() => navigate("/login")}
      className="rounded-lg w-full bg-primary text-surface mt-6"
    >
      Go to Login
    </Button>

  </div>
) :(

    <div className="w-full md:w-1/2 bg-background min-h-screen py-10 px-6 md:px-10 lg:py-24 lg:px-24  flex  flex-col items-center">
    <div className="bg-primary-light w-24 h-24 rounded-full flex justify-center items-center">
<Lock size={40}  className="text-primary"/>
    </div>
    <h2 className="text-text/80 font-semibold text-3xl">Set a new password</h2>
      <form onSubmit={handleSubmit} className="w-full mt-6">
            <div className="mb-4 ">
          <label htmlFor="password" className="text-text-muted text-xs">
            Password
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }
                if (value.length > 0) {
                  const result = zxcvbn.check(value);
                  setPasswordStrength(result);
                } else {
                  setPasswordStrength(null);
                }
              }}
              id="password"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="......."
              className={`w-full border rounded-lg px-3 py-2 pr-10 bg-surface placeholder:text-text-muted placeholder:text-3xl ${
                errors.password ? "border-red-400" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
            </button>
          </div>
         <PasswordStrength passwordStrength={passwordStrength} />

          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>
           <div className="mb-4">
          <label htmlFor="confirmPassword" className="text-text-muted text-xs">
            Confirm Password
          </label>
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                  }));
                }
              }}
              id="confirmPassword"
              autoComplete="new-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="......."
              className={`w-full border rounded-lg px-3 py-2 pr-10 bg-surface placeholder:text-text-muted placeholder:text-3xl  ${
                errors.confirmPassword ? "border-red-400" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => {
                setShowConfirmPassword((prev) => !prev);
              }}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}{" "}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}
          {errors.form && (
  <p className="text-red-500 text-xs mb-2">
    {errors.form}
  </p>
)}
        </div>
        <Button type="submit" disabled={isSubmitting} className=" rounded-lg w-full bg-primary text-surface">Reset Password</Button>
        </form>
    </div>)}
    </div>
}

export default ResetPassword