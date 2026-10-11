import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsOptional()
  @IsString()
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
