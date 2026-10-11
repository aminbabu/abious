import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactService } from './contact.service.js';
import { ContactRepository } from '../repositories/contact.repository.js';
import { MailService } from './mail.service.js';

describe('ContactService', () => {
  let service: ContactService;
  let repo: ContactRepository;
  let mailService: MailService;

  beforeEach(() => {
    repo = {
      create: vi.fn().mockResolvedValue({ id: 'inq-123' }),
      findAll: vi.fn(),
      markAsRead: vi.fn(),
      delete: vi.fn(),
    } as unknown as ContactRepository;

    mailService = {
      sendContactNotification: vi.fn().mockResolvedValue(true),
    } as unknown as MailService;

    service = new ContactService(repo, mailService);
  });

  it('should handle contact submission, create record, and return success', async () => {
    const submission = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello!',
    };

    const res = await service.handleContact(submission, '127.0.0.1');
    expect(res.success).toBe(true);
    expect(res.id).toBe('inq-123');
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
      }),
    );
  });
});
