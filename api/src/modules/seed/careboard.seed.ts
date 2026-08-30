import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusDemandaOrmEntity } from '../status-demanda/infraestructure/orm/status-demanda-orm-entity';
import { StatusInternacaoOrmEntity } from '../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { StatusLeitoOrmEntity } from '../status-leito/infraestructure/orm/status-leito-orm-entity';
import { TipoDemandaOrmEntity } from '../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { TipoUsuarioOrmEntity } from '../tipo-usuario/infraestructure/orm/tipo-usuario-orm-entity';

const bedStatuses = [
  'livre',
  'bloqueado',
  'aguardando desocupação',
  'aguardando higienização',
  'em higienização',
  'ocupado',
];

const demandTypes = ['Assistência', 'Medicação', 'Alimentação', 'Emergência', 'Higiene', 'Outros'];

@Injectable()
export class CareboardSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(CareboardSeed.name);

  constructor(
    @InjectRepository(StatusLeitoOrmEntity)
    private readonly statusLeitoRepository: Repository<StatusLeitoOrmEntity>,
    @InjectRepository(StatusInternacaoOrmEntity)
    private readonly statusInternacaoRepository: Repository<StatusInternacaoOrmEntity>,
    @InjectRepository(TipoDemandaOrmEntity)
    private readonly tipoDemandaRepository: Repository<TipoDemandaOrmEntity>,
    @InjectRepository(StatusDemandaOrmEntity)
    private readonly statusDemandaRepository: Repository<StatusDemandaOrmEntity>,
    @InjectRepository(TipoUsuarioOrmEntity)
    private readonly tipoUsuarioRepository: Repository<TipoUsuarioOrmEntity>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Garantindo tabelas de status e tipos essenciais do sistema (sem dados mockados)...');

    for (const descricao of bedStatuses) {
      await this.findOrCreate(this.statusLeitoRepository, { descricao });
    }

    await this.findOrCreate(this.statusInternacaoRepository, { descricao: 'ativa' });
    await this.findOrCreate(this.statusInternacaoRepository, { descricao: 'encerrada' });

    await this.findOrCreate(this.statusDemandaRepository, { descricao: 'pendente' });
    await this.findOrCreate(this.statusDemandaRepository, { descricao: 'atendida' });

    for (const descricao of demandTypes) {
      await this.findOrCreate(this.tipoDemandaRepository, { descricao });
    }

    await this.findOrCreate(this.tipoUsuarioRepository, { descricao: 'enfermeiro' });
    await this.findOrCreate(this.tipoUsuarioRepository, { descricao: 'paciente' });
    await this.findOrCreate(this.tipoUsuarioRepository, { descricao: 'Leito' });
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
