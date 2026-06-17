import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePatientDemandDto {
  @IsInt()
  admissionId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type!: string;
}
