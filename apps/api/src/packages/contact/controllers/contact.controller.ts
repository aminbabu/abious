import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { ContactService } from '../services/contact.service.js';
import { ContactSubmissionDto } from '../dtos/contact.dto.js';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @AllowAnonymous()
  async submit(@Body() body: ContactSubmissionDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    return this.contactService.handleContact(body, ip);
  }

  @Get('inquiries')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getInquiries() {
    return this.contactService.getAllInquiries();
  }

  @Patch('inquiries/:id/read')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async markRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete('inquiries/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteInquiry(@Param('id') id: string) {
    return this.contactService.deleteInquiry(id);
  }
}
