import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth/me')
  getProfile(@Session() session: UserSession) {
    return {
      authenticated: true,
      user: session.user,
      session: session.session,
    };
  }

  @Get('health')
  @AllowAnonymous()
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
