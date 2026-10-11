import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContactSubmissionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}

export class InquiryQueryDto {
  @IsOptional()
  @IsString()
  isRead?: string;
}
