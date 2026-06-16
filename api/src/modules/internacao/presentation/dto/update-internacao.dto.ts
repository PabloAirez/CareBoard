import { PartialType } from '@nestjs/mapped-types';
import { CreateInternacaoDto } from './create-internacao.dto';

export class UpdateInternacaoDto extends PartialType(CreateInternacaoDto) {}
