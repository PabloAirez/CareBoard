import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePatientDemandDto {
  @IsInt()
  @IsOptional()
  admissionId?: number;

  @IsInt()
  @IsOptional()
  bedId?: number;

  @IsString()
  @IsOptional()
  bedNumber?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type!: string;
}
