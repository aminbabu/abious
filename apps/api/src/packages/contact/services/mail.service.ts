import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

import { renderContactNotificationEmail } from '../../../common/templates/email-templates.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || '127.0.0.1';
    const port = parseInt(process.env.SMTP_PORT || '1025', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      ...(user && pass
        ? {
            auth: {
              user,
              pass,
            },
          }
        : {
            ignoreTLS: !secure && host === '127.0.0.1',
          }),
    });
  }

  async sendContactNotification(inquiry: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    try {
      const receiver =
        process.env.CONTACT_RECEIVER_EMAIL || 'amin.babu.bd@gmail.com';
      const sender =
        process.env.SMTP_FROM ||
        (process.env.SMTP_USER
          ? `"Amin Babu" <${process.env.SMTP_USER}>`
          : `"Abious Portfolio" <no-reply@abious.ddev.site>`);

      const emailContent = renderContactNotificationEmail(inquiry);

      await this.transporter.sendMail({
        from: sender,
        to: receiver,
        replyTo: inquiry.email,
        subject: `New Inquiry from ${inquiry.name}: ${inquiry.subject || 'Portfolio Contact'}`,
        text: emailContent.text,
        html: emailContent.html,
      });

      this.logger.log(`Inquiry notification email sent to ${receiver}`);
      return true;
    } catch (err) {
      this.logger.error(
        'Failed to dispatch contact notification email',
        err instanceof Error ? err.stack : err,
      );
      return false;
    }
  }
}
