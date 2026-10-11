import { Injectable, Logger } from '@nestjs/common';
import { ContactRepository } from '../repositories/contact.repository.js';
import { MailService } from './mail.service.js';
import type { ContactSubmissionDto } from '../dtos/contact.dto.js';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly mailService: MailService,
  ) {}

  async handleContact(submission: ContactSubmissionDto, ipAddress?: string) {
    this.logger.log(`Received contact submission from: ${submission.email}`);

    let record = null;
    try {
      record = await this.contactRepository.create({
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        message: submission.message,
        isRead: false,
        ipAddress: ipAddress || null,
      });
    } catch (err) {
      this.logger.error('Failed to store inquiry in database', err instanceof Error ? err.stack : err);
    }

    // Trigger email notification asynchronously
    void this.mailService.sendContactNotification(submission);

    return {
      success: true,
      message: 'Thank you for reaching out! I will get back to you shortly.',
      id: record?.id,
    };
  }

  async getAllInquiries() {
    return this.contactRepository.findAll();
  }

  async markAsRead(id: string) {
    return this.contactRepository.markAsRead(id);
  }

  async deleteInquiry(id: string) {
    return this.contactRepository.delete(id);
  }
}
