import { IsOptional, IsString } from 'class-validator';

export class ReportFilterDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export interface PlatformOverviewReport {
  timestamp: string;
  inquiries: {
    total: number;
    unread: number;
  };
  content: {
    caseStudies: number;
    services: number;
    testimonials: number;
    experiences: number;
    posts: number;
  };
  users: {
    total: number;
  };
}
