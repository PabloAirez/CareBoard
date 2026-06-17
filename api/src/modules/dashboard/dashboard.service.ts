import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { InternacaoOrmEntity } from '../internacao/infraestructure/orm/internacao-orm-entity';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';
import { SinaisVitaisOrmEntity } from '../sinais-vitais/infraestructure/orm/sinais-vitais-orm-entity';

export interface DashboardBed {
  id: number;
  number: string;
  status: string;
  admissionId: number | null;
  patientId: number | null;
  patientName: string | null;
  admissionDate: Date | null;
  vitals: {
    paSistolica: number;
    paDiastolica: number;
    fc: number;
    fr: number;
    temp: number;
    consciencia: string;
  } | null;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(LeitoOrmEntity)
    private readonly leitoRepository: Repository<LeitoOrmEntity>,
    @InjectRepository(InternacaoOrmEntity)
    private readonly internacaoRepository: Repository<InternacaoOrmEntity>,
    @InjectRepository(SinaisVitaisOrmEntity)
    private readonly sinaisVitaisRepository: Repository<SinaisVitaisOrmEntity>,
  ) {}

  async findBeds(unitId?: number): Promise<DashboardBed[]> {
    const leitos = await this.leitoRepository.find({
      where: unitId ? { unidadeId: unitId } : {},
      relations: { statusLeito: true },
      order: { numero: 'ASC' },
    });

    const internacoes = await this.internacaoRepository.find({
      where: { dataSaida: IsNull() },
      relations: { paciente: true },
      order: { dataEntrada: 'DESC' },
    });

    const activeAdmissionByBed = new Map<number, InternacaoOrmEntity>();

    for (const internacao of internacoes) {
      if (!activeAdmissionByBed.has(internacao.leitoId)) {
        activeAdmissionByBed.set(internacao.leitoId, internacao);
      }
    }

    const patientIds = [...new Set(internacoes.map((item) => item.pacienteId))];
    const latestVitalsByPatient = await this.findLatestVitalsByPatient(patientIds);

    return leitos.map((leito) => {
      const internacao = activeAdmissionByBed.get(leito.id);
      const vitals = internacao
        ? latestVitalsByPatient.get(internacao.pacienteId)
        : undefined;

      return {
        id: leito.id,
        number: leito.numero,
        status: this.toFrontendStatus(leito.statusLeito?.descricao),
        admissionId: internacao?.id ?? null,
        patientId: internacao?.pacienteId ?? null,
        patientName: internacao?.paciente?.nome ?? null,
        admissionDate: internacao?.dataEntrada ?? null,
        vitals: vitals ? this.toVitals(vitals) : null,
      };
    });
  }

  private async findLatestVitalsByPatient(patientIds: number[]) {
    const latestVitalsByPatient = new Map<number, SinaisVitaisOrmEntity>();

    if (patientIds.length === 0) {
      return latestVitalsByPatient;
    }

    const vitals = await this.sinaisVitaisRepository.find({
      where: patientIds.map((pacienteId) => ({ pacienteId })),
      order: { dataHora: 'DESC' },
    });

    for (const item of vitals) {
      if (!latestVitalsByPatient.has(item.pacienteId)) {
        latestVitalsByPatient.set(item.pacienteId, item);
      }
    }

    return latestVitalsByPatient;
  }

  private toVitals(sinaisVitais: SinaisVitaisOrmEntity) {
    return {
      paSistolica: sinaisVitais.pressaoSistolica ?? 0,
      paDiastolica: sinaisVitais.pressaoDiastolica ?? 0,
      fc: sinaisVitais.frequenciaCardiaca ?? 0,
      fr: sinaisVitais.frequenciaRespiratoria ?? 0,
      temp: Number(sinaisVitais.temperatura ?? 0),
      consciencia: sinaisVitais.nivelConsciencia ?? 'Alerta',
    };
  }

  private toFrontendStatus(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'livre':
        return 'Livre';
      case 'ocupado':
        return 'Ocupado';
      case 'bloqueado':
        return 'Bloqueado';
      case 'aguardando higienização':
      case 'aguardando limpeza':
        return 'Aguardando Limpeza';
      case 'em higienização':
      case 'em limpeza':
        return 'Em Limpeza';
      default:
        return 'Livre';
    }
  }
}
