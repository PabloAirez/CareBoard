import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveIntegracaoBancoDto {
  @IsInt()
  hospitalId!: number;

  @IsInt()
  @IsOptional()
  sistemaExternoId?: number;

  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsInt()
  porta!: number;

  @IsString()
  @IsNotEmpty()
  nomeBanco!: string;

  @IsString()
  @IsNotEmpty()
  usuario!: string;

  @IsString()
  @IsNotEmpty()
  senha!: string;
}

export class TestConnectionDto {
  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsInt()
  porta!: number;

  @IsString()
  @IsNotEmpty()
  nomeBanco!: string;

  @IsString()
  @IsNotEmpty()
  usuario!: string;

  @IsString()
  @IsNotEmpty()
  senha!: string;
}
