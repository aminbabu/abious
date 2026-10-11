import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || '127.0.0.1';
    const port = parseInt(process.env.SMTP_PORT || '1025', 10);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      ignoreTLS: true,
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

      await this.transporter.sendMail({
        from: `"Abious Portfolio" <no-reply@abious.ddev.site>`,
        to: receiver,
        subject: `New Inquiry from ${inquiry.name}: ${inquiry.subject || 'Portfolio Contact'}`,
        text: `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nSubject: ${inquiry.subject || 'N/A'}\n\nMessage:\n${inquiry.message}`,
        html: `
          <h3>New Portfolio Inquiry</h3>
          <p><strong>Name:</strong> ${inquiry.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
          <p><strong>Subject:</strong> ${inquiry.subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #10b981;">
            ${inquiry.message.replace(/\n/g, '<br/>')}
          </blockquote>
        `,
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
