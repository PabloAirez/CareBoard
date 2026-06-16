import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUnidadeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsInt()
  hospitalId!: number;
}
