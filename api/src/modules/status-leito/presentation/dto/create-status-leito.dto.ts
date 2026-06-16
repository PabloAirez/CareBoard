import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStatusLeitoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description!: string;
}
