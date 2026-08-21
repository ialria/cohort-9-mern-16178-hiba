require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


async function sendPasswordResetEmail(toEmail, resetLink) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Leaflet <onboarding@resend.dev>",
      to: [toEmail],
      subject: "Reset your Leaflet password",
      html: `
        <div>
          <h2>Reset your password</h2>

          <p>
            We received a request to reset your Leaflet password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a href="${resetLink}">
            Reset Password
          </a>

          <p>
            This link will expire in 15 minutes.
          </p>

          <p>
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Password reset email error:", error);
    throw error;
  }
}
module.exports = {
  sendPasswordResetEmail,
};
// sendTestEmail();
