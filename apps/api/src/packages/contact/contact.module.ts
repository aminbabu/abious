import { Module, DynamicModule } from '@nestjs/common';
import { ContactRepository } from './repositories/contact.repository.js';
import { MailService } from './services/mail.service.js';
import { ContactService } from './services/contact.service.js';
import { ContactController } from './controllers/contact.controller.js';

@Module({
  controllers: [ContactController],
  providers: [ContactRepository, MailService, ContactService],
  exports: [ContactService, ContactRepository, MailService],
})
export class ContactModule {
  static forRoot(): DynamicModule {
    return {
      module: ContactModule,
      controllers: [ContactController],
      providers: [ContactRepository, MailService, ContactService],
      exports: [ContactService, ContactRepository, MailService],
    };
  }
}
