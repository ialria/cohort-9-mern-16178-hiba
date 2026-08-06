import LeafletLogo from "../../icons/leaflet_logo.jsx";
import {Mail, Lock} from "../../icons/icons.jsx";
import {useState} from "react";
import Button from "../../components/Button.jsx"
import {Link} from "react-router-dom";
function ForgotPassword(){
     const [email, setEmail] = useState("");

const [errors, setErrors] = useState({});

  function validateForm() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (email.trim() === "") {
      newErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
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
       

        <main className="bg-background py-6 px-5 md:px-10 h-screen">

        
   <div className="flex items-center gap-2">
        <div
          className="bg-primary p-2 rounded-2xl cursor-pointer outline-none"
        >
          <LeafletLogo className="w-8 h-8 text-surface" />
        </div>
        <span
          className="text-muted font-medium "
        >
          leaflet
        </span>
      </div>
      <section className="border flex flex-col items-center justify-center border-text-muted/30 bg-surface rounded-xl py-10 px-5 md:px-8 mt-4">
<div className="rounded-full w-28 h-28 flex items-center justify-center bg-primary-light relative">
<Mail size={64} strokeWidth={0.75} className="text-notes/50 "/>
<div className="absolute bottom-2 right-3 bg-primary p-2 rounded-full">
<Lock size={14} strokeWidth={1.5} className="text-surface"/>
</div>
</div>
<header className="flex flex-col justify-center items-center text-center py-6 gap-4 w-70">
    <h2 className="text-2xl font-semibold">Forgot Password?</h2>
    <p className="text-sm text-text-muted">No worries! Enter your emai address and we'll send you a resent link.</p>
</header>
        {/* 
        header
        form  */}
        <form onSubmit={handleSubmit} className="w-full md:w-150 md:px-10">
              <div className="mb-6">
          <label htmlFor="email" className="text-text text-xs">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-3 py-2 bg-surface placeholder:text-text-muted  ${
              errors.email ? "border-delete-muted" : "border-text-muted/30"
            }`}
          />
          {errors.email && (
            <p className="text-error text-xs">{errors.email}</p>
          )}
        </div>
        <Button type="submit" className=" rounded-lg w-full bg-primary text-surface">Send Reset Link</Button>
        </form>

        <div className="mt-2"> <p className="text-text-muted text-sm text-center">
          Remember your password?{" "}
          <Link
            to="/login"
            className=" text-notes text-sm cursor-pointer hover:underline"
          >
            Back to Login
          </Link>
        </p></div>
      </section>
        </main>
    );
}

export default ForgotPassword