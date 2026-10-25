import { betterAuth } from 'better-auth';
import { pool } from './db/index.js';

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/$/, '');
}

function buildTrustedOrigins(): string[] {
  const extras = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => normalizeOrigin(v))
    .filter(Boolean);

  return Array.from(
    new Set(
      [
        process.env.CLIENT_URL,
        process.env.BETTER_AUTH_URL,
        'https://aminbabu.com',
        'https://www.aminbabu.com',
        'https://api.aminbabu.com',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://abious.ddev.site',
        'https://api.abious.ddev.site',
        'http://abious.ddev.site',
        'http://api.abious.ddev.site',
        ...extras,
      ]
        .filter(Boolean)
        .map((v) => normalizeOrigin(String(v))),
    ),
  );
}

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'dummy_secret_key_change_in_production_min_32_chars_1234567890',
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://api.aminbabu.com'
      : 'https://api.abious.ddev.site'),
  trustedOrigins: buildTrustedOrigins(),
  database: pool,
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === 'production',
      domain: '.aminbabu.com',
    },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      partitioned: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        required: false,
      },
    },
  },
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

      const { renderPasswordResetEmail } = await import(
        './common/templates/email-templates.js'
      );
      const emailContent = renderPasswordResetEmail({ url, email: user.email });

      await transporter.sendMail({
        from: sender,
        to: user.email,
        subject: 'Reset your Abious Admin password',
        text: emailContent.text,
        html: emailContent.html,
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
