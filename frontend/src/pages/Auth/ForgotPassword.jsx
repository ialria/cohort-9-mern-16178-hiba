import LeafletLogo from "../../icons/leaflet_logo.jsx";
import { Mail, Lock, Check } from "../../icons/icons.jsx";
import { useState, useRef,useEffect } from "react";
import Button from "../../components/Button.jsx";
import { Link } from "react-router-dom";
import { apiFetch } from "../../config/api.js";
function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const headingReference=useRef(null);
  useEffect(() => {
  if (emailSent) {
    headingReference.current?.focus();
  }
}, [emailSent]);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState({});

  const cooldownActive = resendCooldown > 0;

  useEffect(() => {
    if (!cooldownActive) {
      return;
    }
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownActive]);

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
  async function sendResetEmail() {
    try{
  const response = await apiFetch(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      },
    );
  const data = await response.json().catch(()=>({}));
    return { response, data };

    }catch (error){
       throw new Error("Failed to send password reset email.", {
      cause: error,
    });
    }
  

  
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validateForm();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);

      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const { response, data } = await sendResetEmail();

   if (!response.ok) {
  if (response.status === 409) {
    setErrors({
      email: data.message,
    });
  } else {
    setErrors({
      form: data.message,
    });
  }
        return;
      }

      setEmailSent(true);
      setResendCooldown(60);
    } catch (error) {
      console.error("Forgot password error:", error);

      setErrors({
    form: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || resending) {
      return;
    }

    setResending(true);
    setErrors({});

    try {
      const { response, data } = await sendResetEmail();

    if (!response.ok) {
  setErrors({
    form: data.message || "Something went wrong.",
  });
  return;
}
      setResendCooldown(60);
    } catch (error) {
      console.error("Resend email error:", error);

    setErrors({
  form: "Something went wrong. Please try again.",
});
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="bg-background py-6 px-5 md:px-10 min-h-screen">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-2 rounded-2xl cursor-pointer outline-none">
          <LeafletLogo className="w-8 h-8 text-surface" />
        </div>
        <span className="text-muted font-medium ">leaflet</span>
      </div>
      <section className="border flex flex-col items-center justify-center border-text-muted/30 bg-surface rounded-xl py-10 px-5 md:px-8 my-4">
        {emailSent ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Check size={38} strokeWidth={2} className="text-surface" />
              </div>
            </div>

            <header className="flex flex-col items-center text-center py-6 gap-3 max-w-md">
              <h2 ref={headingReference} tabIndex={-1} className="text-2xl font-semibold text-text">
                Check your email
              </h2>

              <p className="text-sm text-text-muted leading-6">
                If an account exists with this email, we've sent you a password
                reset link.
              </p>

              <p className="text-sm font-medium text-text break-all">{email}</p>
            </header>
            <div className="bg-primary-light/50 rounded-lg px-4 py-3 w-full max-w-md">
              <p className="text-xs text-text-muted">
                The reset link will expire in 15 minutes.
              </p>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                Didn't receive the email?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resending}
                className={`mt-1 text-sm font-medium ${
                  resendCooldown > 0 || resending
                    ? "text-text-muted cursor-not-allowed"
                    : "text-notes hover:underline cursor-pointer"
                }`}
              >
                {resendCooldown > 0
                  ? `Resend email in ${resendCooldown}s`
                  : resending
                    ? "Sending..."
                    : "Resend email"}
              </button>
              {errors.form && (
                <p className="text-error text-xs mt-2">{errors.form}</p>
              )}
            </div>

            <div className="mt-6">
              <Link to="/login" className="text-notes text-sm hover:underline">
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {" "}
            <div className="rounded-full w-28 h-28 flex items-center justify-center bg-primary-light relative">
              <Mail size={64} strokeWidth={0.75} className="text-notes/50 " />
              <div className="absolute bottom-2 right-3 bg-primary p-2 rounded-full">
                <Lock size={14} strokeWidth={1.5} className="text-surface" />
              </div>
            </div>
            <header className="flex flex-col justify-center items-center text-center py-6 gap-4 w-70">
              <h2 className="text-2xl font-semibold">Forgot Password?</h2>
              <p className="text-sm text-text-muted">
                No worries! Enter your email address and we'll send you a reset
                link.
              </p>
            </header>
            <form onSubmit={handleSubmit} className="w-full md:w-150 md:px-10">
              <div className="mb-6 text-start">
                <label htmlFor="email" className="text-text text-xs">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email || errors.form) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                        form:""
                      }));
                    }
                  }}
                  placeholder="you@example.com"
                  className={`w-full border rounded-lg px-3 py-2 bg-surface placeholder:text-text-muted  ${
                    errors.email
                      ? "border-delete-muted"
                      : "border-text-muted/30"
                  }`}
                />
                {errors.email && ( 
  <p className="text-error text-xs">{errors.email}</p>
)}
                {errors.form && (
                  <p className="text-error text-xs">{errors.form}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className=" rounded-lg w-full bg-primary text-surface"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            <div className="mt-2">
              {" "}
              <p className="text-text-muted text-sm text-center">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className=" text-notes text-sm cursor-pointer hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default ForgotPassword;
