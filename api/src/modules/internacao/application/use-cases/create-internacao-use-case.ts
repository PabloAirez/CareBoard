import { Injectable } from '@nestjs/common';
import { Internacao } from '../../domain/entities/internacao.entity';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';
import { CreateInternacaoDto } from '../../presentation/dto/create-internacao.dto';

@Injectable()
export class CreateInternacaoUseCase {
  constructor(private readonly repository: InternacaoRepository) {}

  execute(dto: CreateInternacaoDto): Promise<Internacao> {
    const internacao = new Internacao(
      null,
      dto.patientId,
      dto.bedId,
      new Date(dto.admissionDate),
      dto.dischargeDate ? new Date(dto.dischargeDate) : null,
      dto.admissionStatusId,
    );

    return this.repository.create(internacao);
  }
}
