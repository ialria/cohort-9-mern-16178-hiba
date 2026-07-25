import { useState } from "react";
import {Link} from "react-router-dom"
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

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
    <div className=" w-1/2 bg-[#FAF9F6] h-screen py-24 px-36">
      <div className="mb-10">
        <p className="text-3xl font-bold text-[#2B2733]">Welcome back</p>
        <p className="text-[#9891A3] text-sm">
          Log in to continue to your notes
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label htmlFor="email" className="text-[#9891A3] text-xs">
            Email
          </label>
          <input
          id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-3 py-2 bg-[#FFFFFF] placeholder:text-[#9891A3] ${
              errors.email ? "border-red-400" : "border-[#EFEBF3]"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
<div className="mb-2">
        <label htmlFor="password" className="text-[#9891A3] text-xs">
          Password
        </label>
        <div className=" relative">
          <input
          id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="......."
            className={`w-full border rounded-lg px-3 py-2 pr-10 bg-[#FFFFFF] placeholder:text-[#9891A3] ${
              errors.password ? "border-red-400" : "border-[#EFEBF3]"
            }`}
          />

          <button
            type="button"
            onClick={() => {
              setShowPassword((prev)=>!prev);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9891A3] "
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
          </button>
        </div>
           {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
        </div>
     
        <span className=" text-[#2B2733] text-sm block mb-6 text-right">
          Forgot password?
        </span>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#362B4A] py-3 px-3 text-[#FAF9F6] mb-4 cursor-pointer"
        >
          Log in
        </button>
        <p className="text-[#9891A3] text-sm text-center">
          New here? <Link to="/signup" className=" text-[#2B2733] cursor-pointer hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
