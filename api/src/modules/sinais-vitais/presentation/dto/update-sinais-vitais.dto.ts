import { PartialType } from '@nestjs/mapped-types';
import { CreateSinaisVitaisDto } from './create-sinais-vitais.dto';

export class UpdateSinaisVitaisDto extends PartialType(
  CreateSinaisVitaisDto,
) {}
