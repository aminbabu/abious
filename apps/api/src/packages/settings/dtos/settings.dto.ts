import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsObject()
  @IsNotEmpty()
  value!: Record<string, any>;
}

export interface PublicSiteSettings {
  siteName: string;
  siteTitle: string;
  bio: string;
  email: string;
  phone: string;
  resumeUrl: string;
  calcomLink: string;
  socials: Array<{ id: string; title: string; url: string }>;
}
