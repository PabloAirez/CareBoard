import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { StatusDemandaOrmEntity } from '../../../status-demanda/infraestructure/orm/status-demanda-orm-entity';
import { TipoDemandaOrmEntity } from '../../../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';
import { LeitoOrmEntity } from '../../../leito/infraestructure/orm/leito-orm-entity';
import { PacienteOrmEntity } from '../../../paciente/infraestructure/orm/paciente-orm-entity';
import { StatusInternacaoOrmEntity } from '../../../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { DemandaOrmEntity } from '../../infraestructure/orm/demanda-orm-entity';
import { CreatePatientDemandDto } from '../../presentation/dto/create-patient-demand.dto';
import { PendingDemandDto } from '../../presentation/realtime/pending-demand.dto';

const PENDING_STATUS = 'pendente';
const COMPLETED_STATUS = 'atendida';

@Injectable()
export class PendingDemandService {
  constructor(
    @InjectRepository(DemandaOrmEntity)
    private readonly demandaRepository: Repository<DemandaOrmEntity>,
    @InjectRepository(TipoDemandaOrmEntity)
    private readonly tipoDemandaRepository: Repository<TipoDemandaOrmEntity>,
    @InjectRepository(StatusDemandaOrmEntity)
    private readonly statusDemandaRepository: Repository<StatusDemandaOrmEntity>,
    @InjectRepository(InternacaoOrmEntity)
    private readonly internacaoRepository: Repository<InternacaoOrmEntity>,
    @InjectRepository(LeitoOrmEntity)
    private readonly leitoRepository: Repository<LeitoOrmEntity>,
    @InjectRepository(PacienteOrmEntity)
    private readonly pacienteRepository: Repository<PacienteOrmEntity>,
    @InjectRepository(StatusInternacaoOrmEntity)
    private readonly statusInternacaoRepository: Repository<StatusInternacaoOrmEntity>,
  ) {}

  async createPendingDemand(dto: CreatePatientDemandDto): Promise<PendingDemandDto> {
    let targetAdmissionId = dto.admissionId;

    if (!targetAdmissionId && dto.bedId) {
      const activeAdmission = await this.internacaoRepository.findOne({
        where: { leitoId: dto.bedId, dataSaida: IsNull() },
        order: { dataEntrada: 'DESC' },
      });

      if (activeAdmission) {
        targetAdmissionId = activeAdmission.id;
      }
    }

    if (!targetAdmissionId && dto.bedNumber) {
      const leito = await this.leitoRepository.findOne({
        where: { numero: dto.bedNumber },
      });

      if (leito) {
        const activeAdmission = await this.internacaoRepository.findOne({
          where: { leitoId: leito.id, dataSaida: IsNull() },
          order: { dataEntrada: 'DESC' },
        });

        if (activeAdmission) {
          targetAdmissionId = activeAdmission.id;
        } else {
          // Se o leito existir mas nao tiver internacao salva ainda, cria internacao temporaria para o leito
          let paciente = await this.pacienteRepository.findOne({ where: { nome: `Leito ${leito.numero}` } });
          if (!paciente) {
            paciente = await this.pacienteRepository.save(
              this.pacienteRepository.create({ nome: `Leito ${leito.numero}` }),
            );
          }
          let statusInt = await this.statusInternacaoRepository.findOne({ where: { descricao: 'ativa' } });
          if (!statusInt) {
            statusInt = await this.statusInternacaoRepository.save(
              this.statusInternacaoRepository.create({ descricao: 'ativa' }),
            );
          }

          const newAdmission = await this.internacaoRepository.save(
            this.internacaoRepository.create({
              pacienteId: paciente.id,
              leitoId: leito.id,
              dataEntrada: new Date(),
              statusInternacaoId: statusInt.id,
            }),
          );
          targetAdmissionId = newAdmission.id;
        }
      }
    }

    if (!targetAdmissionId && dto.bedId) {
      const leito = await this.leitoRepository.findOne({ where: { id: dto.bedId } });
      if (leito) {
        let paciente = await this.pacienteRepository.findOne({ where: { nome: `Leito ${leito.numero}` } });
        if (!paciente) {
          paciente = await this.pacienteRepository.save(
            this.pacienteRepository.create({ nome: `Leito ${leito.numero}` }),
          );
        }
        let statusInt = await this.statusInternacaoRepository.findOne({ where: { descricao: 'ativa' } });
        if (!statusInt) {
          statusInt = await this.statusInternacaoRepository.save(
            this.statusInternacaoRepository.create({ descricao: 'ativa' }),
          );
        }

        const newAdmission = await this.internacaoRepository.save(
          this.internacaoRepository.create({
            pacienteId: paciente.id,
            leitoId: leito.id,
            dataEntrada: new Date(),
            statusInternacaoId: statusInt.id,
          }),
        );
        targetAdmissionId = newAdmission.id;
      }
    }

    if (!targetAdmissionId) {
      throw new NotFoundException('Leito ou internacao nao encontrados.');
    }

    const tipoDemanda = await this.findOrCreateTipoDemanda(dto.type);
    const statusDemanda = await this.findOrCreateStatusDemanda(PENDING_STATUS);

    const demanda = this.demandaRepository.create({
      internacaoId: targetAdmissionId,
      tipoDemandaId: tipoDemanda.id,
      statusDemandaId: statusDemanda.id,
      dataHoraSolicitacao: new Date(),
      dataHoraAtendimento: null,
      atendidoPorUsuarioId: null,
    });

    const saved = await this.demandaRepository.save(demanda);
    const pending = await this.findPendingById(saved.id);

    return pending ?? this.toDto(saved);
  }

  async findPending(unitId?: number): Promise<PendingDemandDto[]> {
    const demandas = await this.demandaRepository.find({
      where: {
        dataHoraAtendimento: IsNull(),
        atendidoPorUsuarioId: IsNull(),
      },
      relations: {
        internacao: { paciente: true, leito: true },
        tipoDemanda: true,
        statusDemanda: true,
      },
      order: {
        dataHoraSolicitacao: 'ASC',
      },
    });

    const dtos = demandas.map((demanda) => this.toDto(demanda));

    if (unitId) {
      return dtos.filter((d) => d.unitId === Number(unitId));
    }

    return dtos;
  }

  async completeDemand(id: number): Promise<PendingDemandDto | null> {
    const demanda = await this.demandaRepository.findOne({
      where: { id },
      relations: {
        internacao: { paciente: true, leito: true },
        tipoDemanda: true,
        statusDemanda: true,
      },
    });

    if (!demanda) {
      return null;
    }

    const completedStatus = await this.findOrCreateStatusDemanda(COMPLETED_STATUS);

    demanda.statusDemandaId = completedStatus.id;
    demanda.statusDemanda = completedStatus;
    demanda.dataHoraAtendimento = new Date();

    const saved = await this.demandaRepository.save(demanda);

    return this.toDto(saved);
  }

  private async findPendingById(id: number): Promise<PendingDemandDto | null> {
    const demanda = await this.demandaRepository.findOne({
      where: { id },
      relations: {
        internacao: { paciente: true, leito: true },
        tipoDemanda: true,
        statusDemanda: true,
      },
    });

    return demanda ? this.toDto(demanda) : null;
  }

  private async findOrCreateTipoDemanda(descricao: string) {
    const existing = await this.tipoDemandaRepository.findOne({
      where: { descricao },
    });

    if (existing) {
      return existing;
    }

    return this.tipoDemandaRepository.save(
      this.tipoDemandaRepository.create({ descricao }),
    );
  }

  private async findOrCreateStatusDemanda(descricao: string) {
    const existing = await this.statusDemandaRepository.findOne({
      where: { descricao },
    });

    if (existing) {
      return existing;
    }

    return this.statusDemandaRepository.save(
      this.statusDemandaRepository.create({ descricao }),
    );
  }

  private toDto(demanda: DemandaOrmEntity): PendingDemandDto {
    const type = demanda.tipoDemanda?.descricao ?? `Tipo ${demanda.tipoDemandaId}`;
    const status =
      demanda.statusDemanda?.descricao ?? `Status ${demanda.statusDemandaId}`;

    return {
      id: demanda.id,
      admissionId: demanda.internacaoId,
      bedId: demanda.internacao?.leitoId ?? null,
      bedNumber: demanda.internacao?.leito?.numero ?? null,
      unitId: demanda.internacao?.leito?.unidadeId ?? null,
      patientId: demanda.internacao?.pacienteId ?? null,
      patientName: demanda.internacao?.paciente?.nome ?? null,
      type,
      status,
      requestedAt: demanda.dataHoraSolicitacao,
      priority: this.resolvePriority(type),
    };
  }

  private resolvePriority(type: string): 'Normal' | 'Emergência' {
    const normalizedType = type.toLowerCase();

    if (normalizedType.includes('emerg') || normalizedType.includes('urg')) {
      return 'Emergência';
    }

    return 'Normal';
  }
}
