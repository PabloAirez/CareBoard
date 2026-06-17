import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { DemandaOrmEntity } from '../demanda/infraestructure/orm/demanda-orm-entity';
import { HospitalOrmEntity } from '../hospital/infraestructure/orm/hospital-orm-entity';
import { InternacaoOrmEntity } from '../internacao/infraestructure/orm/internacao-orm-entity';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';
import { PacienteOrmEntity } from '../paciente/infraestructure/orm/paciente-orm-entity';
import { SinaisVitaisOrmEntity } from '../sinais-vitais/infraestructure/orm/sinais-vitais-orm-entity';
import { StatusDemandaOrmEntity } from '../status-demanda/infraestructure/orm/status-demanda-orm-entity';
import { StatusInternacaoOrmEntity } from '../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { StatusLeitoOrmEntity } from '../status-leito/infraestructure/orm/status-leito-orm-entity';
import { TipoDemandaOrmEntity } from '../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { TipoUsuarioOrmEntity } from '../tipo-usuario/infraestructure/orm/tipo-usuario-orm-entity';
import { UnidadeOrmEntity } from '../unidade/infraestructure/orm/unidade-orm-entity';
import { UsuarioOrmEntity } from '../usuario/infraestructure/orm/usuario-orm-entity';

const bedStatuses = [
  'livre',
  'bloqueado',
  'aguardando desocupação',
  'aguardando higienização',
  'em higienização',
  'ocupado',
];

const units = ['UTI Adulto', 'Clínica Médica', 'Pediatria'];
const demandTypes = ['Assistência', 'Medicação', 'Alimentação', 'Emergência'];
const patientNames = [
  'João Silva',
  'Maria Santos',
  'Pedro Oliveira',
  'Ana Costa',
  'Carlos Ferreira',
  'Luana Pereira',
  'Roberto Lima',
  'Fernanda Alves',
  'Marcos Rodrigues',
  'Juliana Gomes',
  'Lucas Carvalho',
  'Beatriz Martins',
];

@Injectable()
export class CareboardSeed implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(HospitalOrmEntity)
    private readonly hospitalRepository: Repository<HospitalOrmEntity>,
    @InjectRepository(UnidadeOrmEntity)
    private readonly unidadeRepository: Repository<UnidadeOrmEntity>,
    @InjectRepository(LeitoOrmEntity)
    private readonly leitoRepository: Repository<LeitoOrmEntity>,
    @InjectRepository(PacienteOrmEntity)
    private readonly pacienteRepository: Repository<PacienteOrmEntity>,
    @InjectRepository(InternacaoOrmEntity)
    private readonly internacaoRepository: Repository<InternacaoOrmEntity>,
    @InjectRepository(SinaisVitaisOrmEntity)
    private readonly sinaisVitaisRepository: Repository<SinaisVitaisOrmEntity>,
    @InjectRepository(StatusLeitoOrmEntity)
    private readonly statusLeitoRepository: Repository<StatusLeitoOrmEntity>,
    @InjectRepository(StatusInternacaoOrmEntity)
    private readonly statusInternacaoRepository: Repository<StatusInternacaoOrmEntity>,
    @InjectRepository(TipoDemandaOrmEntity)
    private readonly tipoDemandaRepository: Repository<TipoDemandaOrmEntity>,
    @InjectRepository(StatusDemandaOrmEntity)
    private readonly statusDemandaRepository: Repository<StatusDemandaOrmEntity>,
    @InjectRepository(DemandaOrmEntity)
    private readonly demandaRepository: Repository<DemandaOrmEntity>,
    @InjectRepository(TipoUsuarioOrmEntity)
    private readonly tipoUsuarioRepository: Repository<TipoUsuarioOrmEntity>,
    @InjectRepository(UsuarioOrmEntity)
    private readonly usuarioRepository: Repository<UsuarioOrmEntity>,
  ) {}

  async onApplicationBootstrap() {
    const statuses = await this.seedStatuses();
    const hospital = await this.seedHospital();
    const seededUnits = await this.seedUnits(hospital.id);
    await this.seedBeds(seededUnits, statuses);
    const seededBeds = await this.leitoRepository.find({
      relations: { unidade: true },
      order: { numero: 'ASC' },
    });
    const seededPatients = await this.seedPatients();
    const seededAdmissions = await this.seedAdmissions(
      seededBeds,
      seededPatients,
      statuses.ocupado.id,
      statuses.ativa.id,
    );

    await this.seedUsers(hospital.id, seededBeds);
    await this.seedVitalSigns(seededAdmissions);
    await this.seedDemands(seededAdmissions);
  }

  private async seedStatuses() {
    const statusLeito = new Map<string, StatusLeitoOrmEntity>();

    for (const descricao of bedStatuses) {
      statusLeito.set(
        descricao,
        await this.findOrCreate(this.statusLeitoRepository, { descricao }),
      );
    }

    const ativa = await this.findOrCreate(this.statusInternacaoRepository, {
      descricao: 'ativa',
    });
    await this.findOrCreate(this.statusInternacaoRepository, {
      descricao: 'encerrada',
    });

    await this.findOrCreate(this.statusDemandaRepository, {
      descricao: 'pendente',
    });
    await this.findOrCreate(this.statusDemandaRepository, {
      descricao: 'atendida',
    });

    for (const descricao of demandTypes) {
      await this.findOrCreate(this.tipoDemandaRepository, { descricao });
    }

    await this.findOrCreate(this.tipoUsuarioRepository, {
      descricao: 'enfermeiro',
    });
    await this.findOrCreate(this.tipoUsuarioRepository, {
      descricao: 'paciente',
    });

    return {
      ativa,
      livre: statusLeito.get('livre')!,
      ocupado: statusLeito.get('ocupado')!,
      bloqueado: statusLeito.get('bloqueado')!,
      aguardandoHigienizacao: statusLeito.get('aguardando higienização')!,
      emHigienizacao: statusLeito.get('em higienização')!,
    };
  }

  private async seedHospital() {
    return this.findOrCreate(this.hospitalRepository, {
      nome: 'CareBoard Hospital',
      cnpj: '00.000.000/0001-00',
      endereco: 'Avenida Central, 1000',
    });
  }

  private async seedUnits(hospitalId: number) {
    const seededUnits: UnidadeOrmEntity[] = [];

    for (const nome of units) {
      seededUnits.push(
        await this.findOrCreate(this.unidadeRepository, {
          nome,
          hospitalId,
        }),
      );
    }

    return seededUnits;
  }

  private async seedBeds(
    seededUnits: UnidadeOrmEntity[],
    statuses: Awaited<ReturnType<CareboardSeed['seedStatuses']>>,
  ) {
    const seededBeds: LeitoOrmEntity[] = [];
    const statusCycle = [
      statuses.ocupado,
      statuses.ocupado,
      statuses.ocupado,
      statuses.livre,
      statuses.aguardandoHigienizacao,
      statuses.emHigienizacao,
      statuses.bloqueado,
    ];

    for (const [unitIndex, unidade] of seededUnits.entries()) {
      for (let index = 1; index <= 8; index += 1) {
        const status = statusCycle[(index - 1) % statusCycle.length];
        const bedNumber = `${unitIndex + 1}${index.toString().padStart(2, '0')}`;

        seededBeds.push(
          await this.findOrCreate(this.leitoRepository, {
            numero: bedNumber,
            unidadeId: unidade.id,
            statusLeitoId: status.id,
          }),
        );
      }
    }

    return seededBeds;
  }

  private async seedPatients() {
    const patients: PacienteOrmEntity[] = [];

    for (let index = 0; index < patientNames.length; index += 1) {
      patients.push(
        await this.findOrCreate(this.pacienteRepository, {
          nome: patientNames[index],
          dataNascimento: new Date(1970 + index, index % 12, 10),
          sexo: index % 2 === 0 ? 'M' : 'F',
          temDoencaContagiosa: index === 5,
        }),
      );
    }

    return patients;
  }

  private async seedAdmissions(
    beds: LeitoOrmEntity[],
    patients: PacienteOrmEntity[],
    occupiedStatusId: number,
    statusInternacaoId: number,
  ) {
    const occupiedBeds = beds.slice(0, patients.length);
    const admissions: InternacaoOrmEntity[] = [];

    for (let index = 0; index < occupiedBeds.length; index += 1) {
      const bed = occupiedBeds[index];
      const existingActiveAdmission = await this.internacaoRepository.findOne({
        where: { leitoId: bed.id, dataSaida: IsNull() },
      });

      if (bed.statusLeitoId !== occupiedStatusId) {
        await this.leitoRepository.update(bed.id, {
          statusLeitoId: occupiedStatusId,
        });
      }

      if (existingActiveAdmission) {
        admissions.push(existingActiveAdmission);
        continue;
      }

      admissions.push(
        await this.findOrCreate(this.internacaoRepository, {
          pacienteId: patients[index].id,
          leitoId: bed.id,
          dataEntrada: new Date(Date.now() - (index + 1) * 86400000),
          dataSaida: null,
          statusInternacaoId,
        }),
      );
    }

    return admissions;
  }

  private async seedUsers(hospitalId: number, beds: LeitoOrmEntity[]) {
    const nurseType = await this.findOrCreate(this.tipoUsuarioRepository, {
      descricao: 'enfermeiro',
    });
    const patientType = await this.findOrCreate(this.tipoUsuarioRepository, {
      descricao: 'paciente',
    });

    await this.findOrCreate(this.usuarioRepository, {
      nome: 'hrsj',
      senha: '123456',
      tipoUsuarioId: nurseType.id,
      hospitalId,
    });

    for (const bed of beds) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { nome: bed.numero },
      });

      if (existingUser) {
        await this.usuarioRepository.update(existingUser.id, {
          senha: existingUser.senha || '123456',
          tipoUsuarioId: patientType.id,
          hospitalId,
        });
      } else {
        await this.usuarioRepository.save(
          this.usuarioRepository.create({
            nome: bed.numero,
            senha: '123456',
            tipoUsuarioId: patientType.id,
            hospitalId,
          }),
        );
      }
    }
  }

  private async seedVitalSigns(admissions: InternacaoOrmEntity[]) {
    for (let index = 0; index < admissions.length; index += 1) {
      const admission = admissions[index];
      const existingVitals = await this.sinaisVitaisRepository.findOne({
        where: { pacienteId: admission.pacienteId },
      });

      if (existingVitals) {
        continue;
      }

      await this.findOrCreate(this.sinaisVitaisRepository, {
        pacienteId: admission.pacienteId,
        dataHora: new Date(Date.now() - index * 3600000),
        oximetria: String(96 + (index % 4)),
        usaSuporteOxigenio: index % 5 === 0,
        temperatura: (36.2 + (index % 5) / 10).toFixed(1),
        frequenciaCardiaca: 72 + index,
        frequenciaRespiratoria: 16 + (index % 5),
        pressaoSistolica: 110 + index,
        pressaoDiastolica: 70 + (index % 8),
        nivelConsciencia: 'Alerta',
        mewsScore: index % 4,
      });
    }
  }

  private async seedDemands(admissions: InternacaoOrmEntity[]) {
    const pendingStatus = await this.findOrCreate(this.statusDemandaRepository, {
      descricao: 'pendente',
    });
    const assistance = await this.findOrCreate(this.tipoDemandaRepository, {
      descricao: 'Assistência',
    });
    const medication = await this.findOrCreate(this.tipoDemandaRepository, {
      descricao: 'Medicação',
    });
    const emergency = await this.findOrCreate(this.tipoDemandaRepository, {
      descricao: 'Emergência',
    });
    const types = [assistance, medication, emergency];

    for (let index = 0; index < Math.min(5, admissions.length); index += 1) {
      const existingDemand = await this.demandaRepository.findOne({
        where: {
          internacaoId: admissions[index].id,
          tipoDemandaId: types[index % types.length].id,
          statusDemandaId: pendingStatus.id,
          dataHoraAtendimento: IsNull(),
        },
      });

      if (existingDemand) {
        continue;
      }

      await this.findOrCreate(this.demandaRepository, {
        internacaoId: admissions[index].id,
        tipoDemandaId: types[index % types.length].id,
        statusDemandaId: pendingStatus.id,
        dataHoraSolicitacao: new Date(Date.now() - (index + 1) * 600000),
        dataHoraAtendimento: null,
        atendidoPorUsuarioId: null,
      });
    }
  }

  private async findOrCreate<T extends { id: number }>(
  repository: Repository<T>,
  data: Partial<T>,
): Promise<T> {
  const where = Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  );

  const existing = await repository.findOne({
    where: where as any,
  });

  if (existing) {
    return existing;
  }

  return repository.save(
    repository.create(data as any) as any,
  );
}
}
