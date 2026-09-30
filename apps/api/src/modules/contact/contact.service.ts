import { Injectable } from '@nestjs/common';

export interface ContactSubmission {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

@Injectable()
export class ContactService {
  async handleContact(submission: ContactSubmission) {
    // In local dev, log the inquiry. Ready for email / database persistence in Phase 4.
    console.log('[Contact Service] Received inquiry:', {
      ...submission,
      receivedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Thank you for reaching out! I will get back to you shortly.',
    };
  }
}
