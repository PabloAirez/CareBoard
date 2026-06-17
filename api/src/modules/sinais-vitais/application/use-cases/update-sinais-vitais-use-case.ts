import { Injectable, NotFoundException } from '@nestjs/common';
import { SinaisVitais } from '../../domain/entities/sinais-vitais.entity';
import { SinaisVitaisRepository } from '../../domain/repositories/sinais-vitais.repository';
import { UpdateSinaisVitaisDto } from '../../presentation/dto/update-sinais-vitais.dto';

@Injectable()
export class UpdateSinaisVitaisUseCase {
  constructor(private readonly repository: SinaisVitaisRepository) {}

  async execute(id: number, dto: UpdateSinaisVitaisDto): Promise<SinaisVitais> {
    const sinaisVitais = await this.repository.findById(id);

    if (!sinaisVitais) {
      throw new NotFoundException('Vital signs not found');
    }

    if (dto.patientId !== undefined) {
      sinaisVitais.pacienteId = dto.patientId;
    }

    if (dto.dateTime !== undefined) {
      sinaisVitais.dataHora = new Date(dto.dateTime);
    }

    if (dto.oximetry !== undefined) {
      sinaisVitais.oximetria = dto.oximetry;
    }

    if (dto.usesOxygenSupport !== undefined) {
      sinaisVitais.usaSuporteOxigenio = dto.usesOxygenSupport;
    }

    if (dto.temperature !== undefined) {
      sinaisVitais.temperatura = dto.temperature;
    }

    if (dto.heartRate !== undefined) {
      sinaisVitais.frequenciaCardiaca = dto.heartRate;
    }

    if (dto.respiratoryRate !== undefined) {
      sinaisVitais.frequenciaRespiratoria = dto.respiratoryRate;
    }

    if (dto.systolicPressure !== undefined) {
      sinaisVitais.pressaoSistolica = dto.systolicPressure;
    }

    if (dto.diastolicPressure !== undefined) {
      sinaisVitais.pressaoDiastolica = dto.diastolicPressure;
    }

    if (dto.consciousnessLevel !== undefined) {
      sinaisVitais.nivelConsciencia = dto.consciousnessLevel;
    }

    if (dto.mewsScore !== undefined) {
      sinaisVitais.mewsScore = dto.mewsScore;
    }

    return this.repository.update(sinaisVitais);
  }
}
