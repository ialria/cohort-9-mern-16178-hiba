import { useState } from "react";
import { Link, useNavigate , useLocation} from "react-router-dom";
import {Eye, EyeOff} from "../../icons/icons.jsx";
import {apiFetch} from "../../config/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
function LoginForm() {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate=useNavigate();
  const location = useLocation();
const [isSubmitting, setIsSubmitting] = useState(false);
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
    }
    return newErrors;
  }

 async function handleSubmit(e) {
    e.preventDefault();
      setLoginError("");
    const foundErrors = validateForm();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);

      return;
    }
    setErrors({});
      setIsSubmitting(true);
  try{
const response= await apiFetch("/api/auth/login",{
  method:"POST",
  body:JSON.stringify({
    email, password
  })
});

const data=await response.json();
if (!response.ok) {
  setLoginError(data.message || "Invalid email or password.");
  return;
}
setUser(data.user);
  navigate(location.state?.from || "/dashboard");

  }catch (error){
        setLoginError(
      "Something went wrong. Please try again."
    );
  }finally{
   setIsSubmitting(false);
  }

  }

  return (
    <div className=" w-full md:w-1/2 bg-background h-screen py-10 px-6 md:px-10 lg:py-24 lg:px-24 xl:px">
      <div className="mb-10">
        <p className="text-3xl font-bold text-text">Welcome back</p>
        <p className="text-text-muted text-sm">
          Log in to continue to your notes
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label htmlFor="email" className="text-text-muted text-xs">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>{ setEmail(e.target.value);
                setLoginError("");
                  if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-3 py-2 bg-surface placeholder:text-text-muted ${
              errors.email ? "border-red-400" : "border-border"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="text-text-muted text-xs">
            Password
          </label>
          <div className=" relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>{ setPassword(e.target.value);
                  setLoginError("");
                    if (errors.password) {
                setErrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }
              }}
              placeholder="......."
              className={`w-full border rounded-lg px-3 py-2 pr-10 bg-surface placeholder:text-text-muted placeholder:text-3xl  ${
                errors.password ? "border-red-400" : "border-border"
              }`}
            />

            <button
              type="button"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        <Link
          to="/forgot_password"
          className=" text-text text-sm mb-6 float-right hover:underline"
        >
          Forgot password?
        </Link>
<div className="clear-both" />

<div className="relative">
  {loginError && (
    <p role="alert" className="absolute bottom-full left-0 mb-1 text-red-500 text-xs">
      {loginError}
    </p>
  )}

  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full rounded-lg bg-primary py-3 px-3 text-background mb-4 cursor-pointer"
  >
    Log in
  </button>
</div>

        <p className="text-text-muted text-sm text-center">
          New here?{" "}
          <Link
            to="/signup"
            className=" text-text cursor-pointer hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
