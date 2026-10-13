import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

// Matches YYYY-MM-DD format (or legacy MMM YYYY if present)
const DATE_REGEX = /^(\d{4}-\d{2}-\d{2}|[A-Za-z]{3}\s\d{4})$/;
// Matches YYYY-MM-DD or 'Present'/'present'
const END_DATE_REGEX = /^(\d{4}-\d{2}-\d{2}|[A-Za-z]{3}\s\d{4}|[Pp]resent)$/;

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(DATE_REGEX, {
    message: 'startDate must be a valid date in YYYY-MM-DD format',
  })
  startDate!: string;

  @IsOptional()
  @IsString()
  @Matches(END_DATE_REGEX, {
    message: 'endDate must be in YYYY-MM-DD format or "Present"',
  })
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number = 0;
}

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  company!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  logo!: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number = 0;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePositionDto)
  positions!: CreatePositionDto[];
}
