import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUnidadeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsInt()
  hospitalId!: number;

  @IsString()
  @IsOptional()
  idSistemaExterno?: string;

  @IsString()
  @IsOptional()
  externalSystemId?: string;
}
