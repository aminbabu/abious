import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ContactService, type ContactSubmission } from './contact.service.js';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @AllowAnonymous()
  async submit(@Body() body: ContactSubmission) {
    if (!body || !body.email || !body.message || !body.name) {
      throw new BadRequestException('Name, email, and message are required.');
    }
    return this.contactService.handleContact(body);
  }
}
