import { betterAuth } from 'better-auth';
import { pool } from './db/index.js';

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'dummy_secret_key_change_in_production_min_32_chars_1234567890',
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://api.abious.ddev.site'
      : 'https://api.abious.ddev.site'),
  trustedOrigins: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://abious.ddev.site',
    'https://api.abious.ddev.site',
    'http://abious.ddev.site',
    'http://api.abious.ddev.site',
  ],
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ user, url }) {
      const nodemailerModule = await import('nodemailer');
      const nodemailer = nodemailerModule.default || nodemailerModule;
      const host = process.env.SMTP_HOST || '127.0.0.1';
      const port = parseInt(process.env.SMTP_PORT || '1025', 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const secure = process.env.SMTP_SECURE === 'true' || port === 465;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        ...(smtpUser && smtpPass
          ? {
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            }
          : {
              ignoreTLS: !secure && host === '127.0.0.1',
            }),
      });

      const sender =
        process.env.SMTP_FROM ||
        (smtpUser
          ? `"Amin Babu" <${smtpUser}>`
          : '"Abious Admin" <no-reply@abious.ddev.site>');

      await transporter.sendMail({
        from: sender,
        to: user.email,
        subject: 'Reset your Abious Admin password',
        text: `Reset your password by following this link: ${url}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password for the Abious Admin Dashboard.</p>
            <p style="margin: 24px 0;">
              <a href="${url}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
              </a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #888; font-size: 12px; margin-top: 30px;">Or copy and paste this link: ${url}</p>
          </div>
        `,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
    },
  },
});
