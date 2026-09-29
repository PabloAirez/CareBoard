import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalOrmEntity } from '../hospital/infraestructure/orm/hospital-orm-entity';
import { StatusDemandaOrmEntity } from '../status-demanda/infraestructure/orm/status-demanda-orm-entity';
import { StatusInternacaoOrmEntity } from '../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { StatusLeitoOrmEntity } from '../status-leito/infraestructure/orm/status-leito-orm-entity';
import { TipoDemandaOrmEntity } from '../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { TipoUsuarioOrmEntity } from '../tipo-usuario/infraestructure/orm/tipo-usuario-orm-entity';
import { UsuarioOrmEntity } from '../usuario/infraestructure/orm/usuario-orm-entity';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';

const bedStatuses = [
  'livre',
  'bloqueado',
  'aguardando desocupação',
  'esperando higienização',
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
    @InjectRepository(HospitalOrmEntity)
    private readonly hospitalRepository: Repository<HospitalOrmEntity>,
    @InjectRepository(UsuarioOrmEntity)
    private readonly usuarioRepository: Repository<UsuarioOrmEntity>,
    @InjectRepository(LeitoOrmEntity)
    private readonly leitoRepository: Repository<LeitoOrmEntity>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Garantindo tabelas essenciais e dados iniciais do sistema...');

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

    const tipoEnfermeiro = await this.findOrCreate(this.tipoUsuarioRepository, { descricao: 'enfermeiro' });
    await this.findOrCreate(this.tipoUsuarioRepository, { descricao: 'paciente' });
    await this.findOrCreate(this.tipoUsuarioRepository, { descricao: 'Leito' });
    const tipoHigienizacao = await this.findOrCreate(this.tipoUsuarioRepository, { descricao: 'higienizacao' });

    const hospital = await this.ensureDefaultHospital();

    const usuarioPadrao = await this.usuarioRepository.findOne({
      where: { nome: 'hrsj', hospitalId: hospital.id },
    });

    if (!usuarioPadrao) {
      await this.usuarioRepository.save(
        this.usuarioRepository.create({
          nome: 'hrsj',
          senha: '12345678',
          tipoUsuarioId: tipoEnfermeiro.id,
          hospitalId: hospital.id,
        }),
      );
    }

    const usuarioHigienizacao = await this.usuarioRepository.findOne({
      where: { nome: 'higienizacao', hospitalId: hospital.id },
    });

    if (!usuarioHigienizacao) {
      await this.usuarioRepository.save(
        this.usuarioRepository.create({
          nome: 'higienizacao',
          senha: '123456',
          tipoUsuarioId: tipoHigienizacao.id,
          hospitalId: hospital.id,
        }),
      );
    }

    // Marca 2 leitos com status "esperando higienização" se existirem leitos livres ou disponiveis
    const statusEsperando = await this.statusLeitoRepository.findOne({
      where: [{ descricao: 'esperando higienização' }, { descricao: 'aguardando higienização' }],
    });

    if (statusEsperando) {
      const leitosLivres = await this.leitoRepository.find({
        where: [{ statusLeitoId: 1 }], // livre
        take: 2,
      });

      for (const leito of leitosLivres) {
        leito.statusLeitoId = statusEsperando.id;
        await this.leitoRepository.save(leito);
      }
    }
  }

  private async ensureDefaultHospital(): Promise<HospitalOrmEntity> {
    const nomePadrao = 'Hospital Regional de São Jerônimo';
    const cnpjPadrao = '00.000.000/0001-00';
    const enderecoPadrao = 'Avenida Central, 1000';

    let hospital = await this.hospitalRepository.findOne({ where: { id: 1 } });

    if (!hospital) {
      hospital = await this.hospitalRepository.findOne({ where: { nome: nomePadrao } });
    }

    if (!hospital) {
      hospital = await this.hospitalRepository.save(
        this.hospitalRepository.create({
          id: 1,
          nome: nomePadrao,
          cnpj: cnpjPadrao,
          endereco: enderecoPadrao,
        }),
      );
    }

    const shouldUpdate =
      hospital.nome !== nomePadrao ||
      hospital.cnpj !== cnpjPadrao ||
      hospital.endereco !== enderecoPadrao;

    if (shouldUpdate) {
      await this.hospitalRepository.update(hospital.id, {
        nome: nomePadrao,
        cnpj: cnpjPadrao,
        endereco: enderecoPadrao,
      });
      hospital = await this.hospitalRepository.findOne({ where: { id: hospital.id } });
    }

    if (!hospital) {
      throw new Error('Não foi possível garantir o hospital padrão do sistema.');
    }

    return hospital;
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
