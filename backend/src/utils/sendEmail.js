import nodemailer from 'nodemailer';

// Lazily create a single reusable SMTP transporter from environment config.
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
};

/**
 * Send an email. Never throws â€” returns a result object so callers can decide
 * how to react (status updates should still succeed even if email fails).
 * @returns {Promise<{ sent: boolean, error?: string }>}
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  const tx = getTransporter();
  if (!tx) {
    const msg = 'Email not configured (EMAIL_USER / EMAIL_PASS missing)';
    console.warn(`âœ‰ï¸  ${msg} â€” skipping email to ${to}`);
    return { sent: false, error: msg };
  }

  try {
    const from = process.env.EMAIL_FROM || `"${process.env.ORG_NAME || 'Palakiya Foundation'}" <${process.env.EMAIL_USER}>`;
    await tx.sendMail({ from, to, subject, text, html });
    return { sent: true };
  } catch (err) {
    console.error(`âœ‰ï¸  Failed to send email to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
};

export default sendEmail;

