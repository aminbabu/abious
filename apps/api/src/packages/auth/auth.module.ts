import { Module, DynamicModule } from '@nestjs/common';
import { AuthModule as NestBetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '../../auth.js';
import { AuthService } from './services/auth.service.js';
import { AuthProfileController } from './controllers/auth.controller.js';
import { RolesGuard } from './guards/roles.guard.js';

@Module({
  imports: [NestBetterAuthModule.forRoot({ auth })],
  controllers: [AuthProfileController],
  providers: [AuthService, RolesGuard],
  exports: [AuthService, RolesGuard, NestBetterAuthModule],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [NestBetterAuthModule.forRoot({ auth })],
      controllers: [AuthProfileController],
      providers: [AuthService, RolesGuard],
      exports: [AuthService, RolesGuard, NestBetterAuthModule],
    };
  }
}
