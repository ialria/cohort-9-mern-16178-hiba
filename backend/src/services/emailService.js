require("dotenv").config();
const { Resend } = require("resend");
const logger = require("../utilities/logger");
const resend = new Resend(process.env.RESEND_API_KEY);
if (!process.env.RESEND_FROM_EMAIL) {
  throw new Error("RESEND_FROM_EMAIL is not set");
}
async function sendPasswordResetEmail(toEmail, resetLink) {
  try {
    const emailRequest=resend.emails.send({
      from: `Leaflet <${process.env.RESEND_FROM_EMAIL}>`,
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
    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Password reset email request timed out"));
      }, 10000);
    });
      const { data, error } = await Promise.race([
      emailRequest,
      timeout,
    ]);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
     logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Password reset email failed"
    );
    throw error;
  }
}
module.exports = {
  sendPasswordResetEmail,
};
// sendTestEmail();
