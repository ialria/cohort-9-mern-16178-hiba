import { useEffect, useState } from "react";
import { Eye, EyeOff } from "../../icons/icons.jsx";
import { Link, useNavigate } from "react-router-dom";
import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import confetti from "canvas-confetti";

function Toast({ message }) {
  return (
    <div className="fixed top-5 right-5 z-50 bg-surface border border-primary-light rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
        <span className="text-surface text-sm font-bold">✓</span>
      </div>

      <p className="text-text text-sm">{message}</p>
    </div>
  );
}
const zxcvbn = new ZxcvbnFactory({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

function SignupForm() {
  // useEffect(() => {
  //   confetti({
  //     particleCount: 35,
  //     spread: 45,
  //     startVelocity: 18,
  //     gravity: 1.2,
  //     ticks: 70,
  //     origin: {
  //       x: 0.88,
  //       y: 0.12,
  //     },
  //     scalar: 0.6,
  //   });
  // }, []);
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  // const [acceptedTerms,setAcceptedTerms]=useState(false); done maybe after backend

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
    if (username.trim() === "") {
      newErrors.username = "Please enter your username.";
    }
    // if(!acceptedTerms)
    // {
    //     newErrors.terms="Please accept the Terms of Service.";
    // }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validateForm();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
        setShowToast(true);
        confetti({
          particleCount: 35,
          spread: 45,
          startVelocity: 18,
          gravity: 1.2,
          ticks: 70,
          origin: {
            x: 0.88,
            y: 0.12,
          },
          scalar: 0.6,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
      if (!response.ok) {
        setErrors({
          email: data.message,
        });
        return;
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className=" w-full md:w-1/2 bg-background min-h-screen py-10 px-6 md:px-10 lg:py-24 lg:px-24 xl:px-36">
      <div className="mb-4">
        <p className="text-2xl font-bold text-text">Create your account</p>
        <p className="text-text-muted text-sm">
          Start organizing your thoughts today.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="text-text-muted text-xs">
            Username
          </label>

          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);

              if (errors.username) {
                setErrors((prev) => ({
                  ...prev,
                  username: "",
                }));
              }
            }}
            id="username"
            type="text"
            placeholder="Your username"
            className={`w-full border rounded-lg px-3 py-2 bg-surface placeholder:text-text-muted ${
              errors.username ? "border-red-400" : "border-border"
            }`}
          />

          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-text-muted text-xs">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-3 py-2 bg-surface placeholder:text-text-muted ${
              errors.email ? "border-red-400" : "border-border"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
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
          {password && passwordStrength && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                  const filledCircles = Math.min(
                    Math.ceil((passwordStrength.score + 1) * 1.6),
                    8,
                  );
                  return (
                    <span
                      key={index}
                      className={`h-2 w-2 rounded-full border ${
                        index < filledCircles
                          ? passwordStrength.score <= 1
                            ? "bg-red-500 border-red-500"
                            : passwordStrength.score === 2
                              ? "bg-yellow-500 border-yellow-500"
                              : "bg-green-500 border-green-500"
                          : "bg-transparent border-text-muted/30"
                      }`}
                    />
                  );
                })}
              </div>

              <span
                className={`text-xs font-medium ${
                  passwordStrength.score <= 1
                    ? "text-red-500"
                    : passwordStrength.score === 2
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              >
                {passwordStrength.score === 0 && "Very weak"}
                {passwordStrength.score === 1 && "Weak"}
                {passwordStrength.score === 2 && "Fair"}
                {passwordStrength.score === 3 && "Strong"}
                {passwordStrength.score === 4 && "Very strong"}
              </span>
            </div>
          )}
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>
        <div className="mb-2">
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
        </div>
        {/* <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e)=>setAcceptedTerms(e.target.checked)}
            id="terms"
            className="mr-2  accent-[#2B2733] cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-[#2B2733]">
            I agree to the{" "}
            <Link to="/termsOfService"
           
              className={`underline hover:no-underline ${
    errors.terms ? "text-red-500" : "text-[#2B2733]"
  }`}
            >
              {" "}
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacyPolicy"
              className={`text-[#362B4A] underline hover:no-underline ${
    errors.terms ? "text-red-500" : "text-[#2B2733]"
  }`}
            >
              Privacy Policy
            </Link>
            .
          </label>
          
        </div>
              {errors.terms && (
  <p className="text-red-500 text-xs mb-4">
    {errors.terms}
  </p>
)} */}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 px-3 text-background my-3 cursor-pointer"
        >
          Create Account
        </button>
      </form>

      {/* <div className="flex items-center gap-4 mb-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      <button className="w-full rounded-lg bg-primary-light py-3 px-3 text-[#7b7389] mb-2 text-sm cursor-pointer">
        Continue with Google
      </button>
      <button className="w-full rounded-lg bg-primary-light py-3 px-3 text-[#7b7389] mb-4 text-sm cursor-pointer">
        Continue with Github
      </button> */}

      <p className="text-text-muted text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-text hover:underline">
          Log in
        </Link>
      </p>
      {showToast && (
        <Toast message={"Account has been created successfully!"} />
      )}
    </div>
  );
}

export default SignupForm;
