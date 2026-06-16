import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  cnpj!: string;

  @IsString()
  @IsOptional()
  endereco?: string;
}
