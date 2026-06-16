import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusLeitoDto } from './create-status-leito.dto';

export class UpdateStatusLeitoDto extends PartialType(CreateStatusLeitoDto) {}
