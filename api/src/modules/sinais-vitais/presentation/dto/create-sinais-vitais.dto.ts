import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSinaisVitaisDto {
  @IsInt()
  patientId!: number;

  @IsDateString()
  dateTime!: string;

  @IsNumberString()
  @IsOptional()
  oximetry?: string;

  @IsBoolean()
  @IsOptional()
  usesOxygenSupport?: boolean;

  @IsNumberString()
  @IsOptional()
  temperature?: string;

  @IsInt()
  @IsOptional()
  heartRate?: number;

  @IsInt()
  @IsOptional()
  respiratoryRate?: number;

  @IsInt()
  @IsOptional()
  systolicPressure?: number;

  @IsInt()
  @IsOptional()
  diastolicPressure?: number;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  consciousnessLevel?: string;

  @IsInt()
  @IsOptional()
  mewsScore?: number;
}
