/**
 * Production-ready email templates for Abious Portfolio & Admin services.
 * Features:
 * - Fluid, responsive layout compatible across modern clients (Gmail, Outlook, Apple Mail)
 * - Brand styling: dark accents, refined typography, emerald highlight (#10b981), crisp borders
 * - Accessible text hierarchy, bulletproof CTA buttons, and complete plain-text fallbacks
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

export function renderContactNotificationEmail(data: ContactNotificationData): {
  html: string;
  text: string;
} {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeSubject = escapeHtml(data.subject || 'Portfolio Contact Inquiry');
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');
  const dateFormatted = new Date(data.submittedAt || Date.now()).toUTCString();

  const text = `NEW PORTFOLIO INQUIRY
========================================
From: ${data.name} (${data.email})
Date: ${dateFormatted}
Subject: ${data.subject || 'Portfolio Contact Inquiry'}

Message:
----------------------------------------
${data.message}
----------------------------------------
Direct Reply: mailto:${data.email}
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry from ${safeName}</title>
  <!--[if mso]>
  <style type="text/css">
    table, td, p, a, h1, h2, h3 { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0c0d0e; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #16181a; border: 1px solid #272a2e; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);">
          <!-- Top Header Banner -->
          <tr>
            <td style="padding: 32px 36px 24px; border-bottom: 1px solid #272a2e; background: linear-gradient(180deg, #1a1d20 0%, #16181a 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; background-color: rgba(16, 185, 129, 0.12); padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.25);">
                      ./incoming-inquiry
                    </span>
                    <h1 style="margin: 16px 0 6px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; line-height: 1.3;">
                      New Portfolio Inquiry
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #9da3ae; line-height: 1.5;">
                      Received via your personal portfolio contact form on ${dateFormatted}.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inquiry Metadata -->
          <tr>
            <td style="padding: 28px 36px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121315; border: 1px solid #272a2e; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #1f2226;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="90" style="font-size: 11px; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600;">Sender</td>
                        <td style="font-size: 14px; font-weight: 600; color: #f3f4f6;">${safeName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #1f2226;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="90" style="font-size: 11px; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600;">Email</td>
                        <td>
                          <a href="mailto:${safeEmail}" style="font-size: 14px; font-weight: 500; color: #10b981; text-decoration: none; word-break: break-all;">
                            ${safeEmail}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="90" style="font-size: 11px; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600;">Subject</td>
                        <td style="font-size: 14px; font-weight: 500; color: #e5e7eb;">${safeSubject}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Body -->
              <div style="margin-bottom: 8px;">
                <span style="font-size: 11px; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600;">Message Content</span>
              </div>
              <div style="background-color: #121315; border-left: 3px solid #10b981; border-top: 1px solid #272a2e; border-right: 1px solid #272a2e; border-bottom: 1px solid #272a2e; border-radius: 0 8px 8px 0; padding: 20px 24px; color: #e5e7eb; font-size: 14px; line-height: 1.6; word-break: break-word;">
                ${safeMessage}
              </div>

              <!-- Action Call to Action -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(data.subject || 'Portfolio Inquiry')}" style="display: inline-block; background-color: #10b981; color: #0c0d0e; font-size: 13px; font-weight: 700; font-family: ui-monospace, Menlo, monospace; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.02em; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
                      Reply directly to ${safeName} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px 28px; border-top: 1px solid #272a2e; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-family: ui-monospace, monospace; color: #6b7280; line-height: 1.5;">
                Amin Babu Portfolio &bull; abious.ddev.site &bull; Automated notification
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, text };
}

export function renderPasswordResetEmail(data: PasswordResetData): {
  html: string;
  text: string;
} {
  const safeUrl = escapeHtml(data.url);
  const text = `ABIOUS ADMIN - PASSWORD RESET REQUEST
========================================
A password reset was requested for your Abious Admin account.

Follow this link to choose a new password:
${data.url}

If you did not make this request, you can safely ignore this email.
This link will expire soon for security purposes.
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
  <!--[if mso]>
  <style type="text/css">
    table, td, p, a, h1, h2, h3 { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0c0d0e; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #16181a; border: 1px solid #272a2e; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);">
          <!-- Top Header -->
          <tr>
            <td style="padding: 32px 36px 20px; border-bottom: 1px solid #272a2e; background: linear-gradient(180deg, #1a1d20 0%, #16181a 100%);">
              <span style="display: inline-block; font-size: 11px; font-weight: 700; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; background-color: rgba(16, 185, 129, 0.12); padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.25);">
                ./security-action
              </span>
              <h1 style="margin: 16px 0 6px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; line-height: 1.3;">
                Password Reset Request
              </h1>
              <p style="margin: 0; font-size: 13px; color: #9da3ae; line-height: 1.5;">
                We received a request to reset your password for the Abious Admin Dashboard.
              </p>
            </td>
          </tr>

          <!-- Action Body -->
          <tr>
            <td style="padding: 28px 36px;">
              <p style="margin: 0 0 20px; font-size: 14px; color: #d1d5db; line-height: 1.6;">
                Click the button below to choose a new password. For your security, this link is valid for a limited time.
              </p>

              <!-- Primary CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${safeUrl}" style="display: inline-block; background-color: #10b981; color: #0c0d0e; font-size: 13px; font-weight: 700; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; text-decoration: none; padding: 13px 32px; border-radius: 6px; letter-spacing: 0.02em; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
                      Reset Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <div style="background-color: #121315; border: 1px solid #272a2e; border-radius: 8px; padding: 14px 16px; margin-top: 24px;">
                <p style="margin: 0 0 6px; font-size: 11px; font-family: ui-monospace, monospace; color: #6b7280; font-weight: 600;">
                  Button not working? Copy and paste this URL into your browser:
                </p>
                <p style="margin: 0; font-size: 11px; font-family: ui-monospace, monospace; color: #9da3ae; word-break: break-all; line-height: 1.4;">
                  ${safeUrl}
                </p>
              </div>

              <!-- Security Notice -->
              <p style="margin: 24px 0 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
                If you did not request this password reset, no action is needed. Your existing credentials remain secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px 28px; border-top: 1px solid #272a2e; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-family: ui-monospace, monospace; color: #6b7280; line-height: 1.5;">
                Abious Platform Security &bull; automated message
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
