import { Injectable, NotFoundException } from '@nestjs/common';
import { Internacao } from '../../domain/entities/internacao.entity';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';
import { UpdateInternacaoDto } from '../../presentation/dto/update-internacao.dto';

@Injectable()
export class UpdateInternacaoUseCase {
  constructor(private readonly repository: InternacaoRepository) {}

  async execute(id: number, dto: UpdateInternacaoDto): Promise<Internacao> {
    const internacao = await this.repository.findById(id);

    if (!internacao) {
      throw new NotFoundException('Admission not found');
    }

    if (dto.patientId !== undefined) {
      internacao.pacienteId = dto.patientId;
    }

    if (dto.bedId !== undefined) {
      internacao.leitoId = dto.bedId;
    }

    if (dto.admissionDate !== undefined) {
      internacao.dataEntrada = new Date(dto.admissionDate);
    }

    if (dto.dischargeDate !== undefined) {
      internacao.dataSaida = dto.dischargeDate
        ? new Date(dto.dischargeDate)
        : null;
    }

    if (dto.admissionStatusId !== undefined) {
      internacao.statusInternacaoId = dto.admissionStatusId;
    }

    return this.repository.update(internacao);
  }
}
