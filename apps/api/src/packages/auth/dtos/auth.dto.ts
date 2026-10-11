import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  role!: 'admin' | 'editor' | 'user';
}

export class UserProfileResponseDto {
  id!: string;
  name!: string;
  email!: string;
  role!: string;
  image?: string;
  emailVerified!: boolean;
  createdAt!: string;
}
