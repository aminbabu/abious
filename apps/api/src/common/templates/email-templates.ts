/**
 * Production-ready email templates for Abious Portfolio & Admin services.
 * Features:
 * - Adaptive light/dark theme: clean light base that blends into light inboxes
 *   (e.g. Gmail web) and adapts via prefers-color-scheme: dark in supporting clients
 * - Shared responsive shell compatible across Gmail, Outlook, and Apple Mail
 * - Inbox preheader text, emerald brand accent, and complete plain-text fallbacks
 */

export interface ContactNotificationData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  submittedAt?: Date | string;
}

export interface PasswordResetData {
  url: string;
  email?: string;
  requestedAt?: Date | string;
}

interface EmailShellOptions {
  title: string;
  preheader: string;
  badge: string;
  heading: string;
  subtitle: string;
  bodyHtml: string;
  footerNote: string;
  maxWidth?: number;
}

function getSiteHost(): string {
  const raw = process.env.CLIENT_URL || 'https://aminbabu.com';
  return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'aminbabu.com';
}

function formatUtcTimestamp(value?: Date | string): string {
  const date = value ? new Date(value) : new Date();
  return (
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(date) + ' UTC'
  );
}

function renderEmailShell(opts: EmailShellOptions): string {
  const maxWidth = opts.maxWidth ?? 600;
  const siteHost = escapeHtml(getSiteHost());
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(opts.title)}</title>
  <style type="text/css">
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .email-bg {
        background-color: #0c0d0e !important;
      }
      .email-card {
        background-color: #16181a !important;
        border-color: #272a2e !important;
      }
      .email-header {
        background-color: #1a1d20 !important;
        border-bottom-color: #272a2e !important;
      }
      .email-footer {
        background-color: #131517 !important;
        border-top-color: #272a2e !important;
      }
      .email-surface {
        background-color: #121315 !important;
        border-color: #272a2e !important;
      }
      .email-row-border {
        border-bottom-color: #1f2226 !important;
      }
      .email-title {
        color: #ffffff !important;
      }
      .email-text {
        color: #e5e7eb !important;
      }
      .email-muted {
        color: #9da3ae !important;
      }
      .email-label {
        color: #6b7280 !important;
      }
      .email-badge {
        background-color: #112922 !important;
        border-color: #1e4d3e !important;
        color: #34d399 !important;
      }
      .email-link {
        color: #34d399 !important;
      }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    table, td, p, a, h1, h2, h3 { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body class="email-bg" style="margin: 0; padding: 0; width: 100% !important; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Hidden inbox preheader -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #f4f4f5; opacity: 0;">
    ${escapeHtml(opts.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: ${maxWidth}px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 3px; background-color: #10b981; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td class="email-header" style="padding: 28px 32px 22px; border-bottom: 1px solid #e4e4e7; background-color: #fafafa;">
              <span class="email-badge" style="display: inline-block; font-size: 11px; font-weight: 700; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.08em; color: #047857; background-color: #ecfdf5; padding: 4px 10px; border-radius: 9999px; border: 1px solid #a7f3d0;">
                ${escapeHtml(opts.badge)}
              </span>
              <h1 class="email-title" style="margin: 14px 0 6px; font-size: 22px; font-weight: 700; color: #18181b; letter-spacing: -0.02em; line-height: 1.3;">
                ${escapeHtml(opts.heading)}
              </h1>
              <p class="email-muted" style="margin: 0; font-size: 13px; color: #52525b; line-height: 1.5;">
                ${escapeHtml(opts.subtitle)}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 32px;">
              ${opts.bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="email-footer" style="padding: 18px 32px 24px; border-top: 1px solid #e4e4e7; background-color: #fafafa; text-align: center;">
              <p class="email-label" style="margin: 0; font-size: 11px; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; color: #71717a; line-height: 1.6;">
                &copy; ${year} Amin Babu &bull; <a href="https://${siteHost}" class="email-muted" style="color: #52525b; text-decoration: none;">${siteHost}</a> &bull; ${escapeHtml(opts.footerNote)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderContactNotificationEmail(data: ContactNotificationData): {
  html: string;
  text: string;
} {
  const subjectText = data.subject?.trim() || 'Portfolio Contact Inquiry';
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeSubject = escapeHtml(subjectText);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');
  const dateFormatted = formatUtcTimestamp(data.submittedAt);
  const preview = data.message.replace(/\s+/g, ' ').trim().slice(0, 110);

  const text = `NEW PORTFOLIO INQUIRY
========================================
From: ${data.name} <${data.email}>
Date: ${dateFormatted}
Subject: ${subjectText}

Message:
----------------------------------------
${data.message}
----------------------------------------
Reply: mailto:${data.email}
`;

  const bodyHtml = `
    <table role="presentation" class="email-surface" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td class="email-row-border" style="padding: 14px 18px; border-bottom: 1px solid #e4e4e7;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="88" valign="top" class="email-label" style="font-size: 11px; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; font-weight: 600; padding-top: 2px;">Sender</td>
              <td valign="top" class="email-title" style="font-size: 14px; font-weight: 600; color: #18181b;">${safeName}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="email-row-border" style="padding: 14px 18px; border-bottom: 1px solid #e4e4e7;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="88" valign="top" class="email-label" style="font-size: 11px; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; font-weight: 600; padding-top: 2px;">Email</td>
              <td valign="top">
                <a href="mailto:${safeEmail}" class="email-link" style="font-size: 14px; font-weight: 500; color: #059669; text-decoration: none; word-break: break-all;">
                  ${safeEmail}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="88" valign="top" class="email-label" style="font-size: 11px; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; font-weight: 600; padding-top: 2px;">Subject</td>
              <td valign="top" class="email-text" style="font-size: 14px; font-weight: 500; color: #27272a;">${safeSubject}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="margin-bottom: 8px;">
      <span class="email-label" style="font-size: 11px; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; font-weight: 600;">Message</span>
    </div>
    <div class="email-surface email-text" style="background-color: #fafafa; border-left: 3px solid #10b981; border-top: 1px solid #e4e4e7; border-right: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; border-radius: 0 8px 8px 0; padding: 18px 20px; color: #27272a; font-size: 14px; line-height: 1.65; word-break: break-word;">
      ${safeMessage}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 26px;">
      <tr>
        <td align="center">
          <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subjectText)}" style="display: inline-block; background-color: #10b981; color: #ffffff; font-size: 13px; font-weight: 700; font-family: ui-monospace, Menlo, monospace; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.02em;">
            Reply to ${safeName} &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = renderEmailShell({
    title: `New Inquiry from ${data.name}`,
    preheader: `${data.name}: ${preview}`,
    badge: './incoming-inquiry',
    heading: 'New Portfolio Inquiry',
    subtitle: `Submitted via contact form on ${dateFormatted}`,
    bodyHtml,
    footerNote: 'Contact notification',
    maxWidth: 600,
  });

  return { html, text };
}

export function renderPasswordResetEmail(data: PasswordResetData): {
  html: string;
  text: string;
} {
  const safeUrl = escapeHtml(data.url);
  const safeEmail = data.email ? escapeHtml(data.email) : '';
  const dateFormatted = formatUtcTimestamp(data.requestedAt);

  const text = `ABIOUS ADMIN - PASSWORD RESET REQUEST
========================================
${data.email ? `Account: ${data.email}\n` : ''}Requested: ${dateFormatted}

Follow this link to choose a new password:
${data.url}

If you did not make this request, you can safely ignore this email.
This link will expire soon for security purposes.
`;

  const accountBanner = safeEmail
    ? `<div class="email-surface" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
        <span class="email-label" style="font-size: 11px; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; font-weight: 600;">Account</span>
        <div class="email-title" style="margin-top: 4px; font-size: 14px; font-weight: 600; color: #18181b;">${safeEmail}</div>
      </div>`
    : '';

  const bodyHtml = `
    ${accountBanner}
    <p class="email-text" style="margin: 0 0 20px; font-size: 14px; color: #3f3f46; line-height: 1.65;">
      Click the button below to choose a new password for your admin account. For your security, this link is valid for a limited time and can only be used once.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 26px 0;">
      <tr>
        <td align="center">
          <a href="${safeUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; font-size: 13px; font-weight: 700; font-family: ui-monospace, Menlo, Consolas, monospace; text-decoration: none; padding: 13px 32px; border-radius: 6px; letter-spacing: 0.02em;">
            Reset Password &rarr;
          </a>
        </td>
      </tr>
    </table>

    <div class="email-surface" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 14px 16px; margin-top: 24px;">
      <p class="email-label" style="margin: 0 0 6px; font-size: 11px; font-family: ui-monospace, Menlo, monospace; color: #71717a; font-weight: 600;">
        Button not working? Copy and paste this URL into your browser:
      </p>
      <p class="email-muted" style="margin: 0; font-size: 11px; font-family: ui-monospace, Menlo, monospace; color: #52525b; word-break: break-all; line-height: 1.45;">
        ${safeUrl}
      </p>
    </div>

    <p class="email-label" style="margin: 22px 0 0; font-size: 12px; color: #71717a; line-height: 1.55;">
      If you did not request this password reset, no action is needed. Your existing credentials remain secure.
    </p>
  `;

  const html = renderEmailShell({
    title: 'Reset your password',
    preheader: 'Reset your Abious Admin password — this link expires soon.',
    badge: './security-action',
    heading: 'Password Reset Request',
    subtitle: `Requested on ${dateFormatted}`,
    bodyHtml,
    footerNote: 'Platform security',
    maxWidth: 560,
  });

  return { html, text };
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
