require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// async function sendTestEmail() {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: "hibasaud18@gmail.com",
//       subject: "Leaflet Test Email",
//       html: `
//         <h2>Hello from Leaflet 🌿</h2>
//         <p>Your email service is working!</p>
//       `,
//     });

//     if (error) {
//       console.log("Email error:", error);
//       return;
//     }

//     console.log("Email sent successfully:", data);
//   } catch (error) {
//     console.log("Something went wrong:", error);
//   }
// }

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
