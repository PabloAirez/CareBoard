import { PartialType } from '@nestjs/mapped-types';
import { CreateLeitoDto } from './create-leito.dto';

export class UpdateLeitoDto extends PartialType(CreateLeitoDto) {}
