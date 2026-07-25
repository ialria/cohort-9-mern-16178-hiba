import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {Link} from 'react-router-dom'

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms,setAcceptedTerms]=useState(false);

  function validateForm() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (email.trim() === "") {
      newErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (password.trim() === "") {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if(!acceptedTerms)
    {
        newErrors.terms="Terms of Service not accepted";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validateForm();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }
    setErrors({});
  }

  return (
    <div className=" w-1/2 bg-[#FAF9F6] py-8 px-36">
      <div className="mb-4">
        <p className="text-2xl font-bold text-[#2B2733]">Create your account</p>
        <p className="text-[#9891A3] text-sm">
          Start organizing your thoughts today.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="text-[#9891A3] text-xs">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-3 py-2 bg-[#FFFFFF] placeholder:text-[#9891A3] ${
              errors.email ? "border-red-400" : "border-[#EFEBF3]"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
        <div className="mb-4 ">
          <label htmlFor="password" className="text-[#9891A3] text-xs">
            Password
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="......."
              className={`w-full border rounded-lg px-3 py-2 pr-10 bg-[#FFFFFF] placeholder:text-3xl ${
              errors.password ? "border-red-400" : "border-[#EFEBF3]"}`}
            />
            <button
              type="button"
              onClick={() => {
                setShowPassword((prev)=>!prev);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9891A3] cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>
        <div className="mb-2">
          <label htmlFor="confirmPassword" className="text-[#9891A3] text-xs">
            Confirm Password
          </label>
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="......."
              className={`w-full border rounded-lg px-3 py-2 pr-10 bg-[#FFFFFF] placeholder:text-3xl ${
              errors.confirmPassword ? "border-red-400" : "border-[#EFEBF3]"}`}
            />
            <button
              type="button"
              onClick={() => {
                setShowConfirmPassword((prev)=>!prev);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9891A3] cursor-pointer"
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
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e)=>setAcceptedTerms(e.target.checked)}
            id="terms"
            className="mr-2  accent-[#2B2733] cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-[#2B2733]">
            I agree to the{" "}
            <a
              href="/terms"
              className={`underline hover:no-underline ${
    errors.terms ? "text-red-500" : "text-[#2B2733]"
  }`}
            >
              {" "}
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className={`text-[#362B4A] underline hover:no-underline ${
    errors.terms ? "text-red-500" : "text-[#2B2733]"
  }`}
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#362B4A] py-3 px-3 text-[#FAF9F6] mb-3 cursor-pointer"
        >
          Create Account
        </button>
      </form>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      <button className="w-full rounded-lg bg-[#F1EDF6] py-3 px-3 text-[#7b7389] mb-2 text-sm cursor-pointer">
        Continue with Google
      </button>
      <button className="w-full rounded-lg bg-[#F1EDF6] py-3 px-3 text-[#7b7389] mb-4 text-sm cursor-pointer">
        Continue with Github
      </button>
      <p className="text-[#9891A3] text-sm text-center">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-[#2B2733] hover:underline"
  >
    Log in
  </Link>
</p>
    </div>
  );
}

export default SignupForm;
