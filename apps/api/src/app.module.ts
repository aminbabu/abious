import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { auth } from './auth.js';
import { CaseStudiesModule } from './modules/case-studies/case-studies.module.js';
import { ContactModule } from './modules/contact/contact.module.js';
import { TestimonialsModule } from './modules/testimonials/testimonials.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    AuthModule.forRoot({ auth }),
    CaseStudiesModule,
    TestimonialsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
