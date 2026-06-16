import { Injectable } from '@nestjs/common';
import { SinaisVitais } from '../../domain/entities/sinais-vitais.entity';
import { SinaisVitaisRepository } from '../../domain/repositories/sinais-vitais.repository';
import { CreateSinaisVitaisDto } from '../../presentation/dto/create-sinais-vitais.dto';

@Injectable()
export class CreateSinaisVitaisUseCase {
  constructor(private readonly repository: SinaisVitaisRepository) {}

  execute(dto: CreateSinaisVitaisDto): Promise<SinaisVitais> {
    const sinaisVitais = new SinaisVitais(
      null,
      dto.patientId,
      new Date(dto.dateTime),
      dto.oximetry ?? null,
      dto.usesOxygenSupport ?? null,
      dto.temperature ?? null,
      dto.heartRate ?? null,
      dto.respiratoryRate ?? null,
      dto.systolicPressure ?? null,
      dto.diastolicPressure ?? null,
      dto.consciousnessLevel ?? null,
      dto.mewsScore ?? null,
    );

    return this.repository.create(sinaisVitais);
  }
}
