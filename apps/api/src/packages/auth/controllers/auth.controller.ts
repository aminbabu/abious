import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AllowAnonymous, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { AuthService } from '../services/auth.service.js';
import { Roles } from '../decorators/roles.decorator.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { UpdateUserRoleDto } from '../dtos/auth.dto.js';

@Controller('api/auth')
export class AuthProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get('session')
  @AllowAnonymous()
  async getSession(@Session() session: UserSession | null) {
    return {
      authenticated: !!session,
      session: session ?? null,
    };
  }

  @Get('me')
  async getProfile(@Session() session: UserSession) {
    if (!session || !session.user) {
      return null;
    }
    return this.authService.getUserById(session.user.id);
  }

  @Patch('role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateRole(@Body() body: UpdateUserRoleDto) {
    return this.authService.updateUserRole(body.userId, body.role);
  }
}
