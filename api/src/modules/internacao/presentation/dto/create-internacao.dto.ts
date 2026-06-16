import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateInternacaoDto {
  @IsInt()
  patientId!: number;

  @IsInt()
  bedId!: number;

  @IsDateString()
  admissionDate!: string;

  @IsDateString()
  @IsOptional()
  dischargeDate?: string;

  @IsInt()
  admissionStatusId!: number;
}
