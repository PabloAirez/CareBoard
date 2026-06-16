import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLeitoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  number!: string;

  @IsInt()
  unitId!: number;

  @IsInt()
  bedStatusId!: number;
}
