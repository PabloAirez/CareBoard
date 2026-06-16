import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsIn(['M', 'F'])
  @IsOptional()
  sex?: string;

  @IsBoolean()
  @IsOptional()
  hasContagiousDisease?: boolean;
}
