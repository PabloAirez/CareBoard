import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LeitoOrmEntity } from '../../../leito/infraestructure/orm/leito-orm-entity';
import { StatusLeitoOrmEntity } from '../../../status-leito/infraestructure/orm/status-leito-orm-entity';
import { HigienizacaoOrmEntity } from '../../infraestructure/orm/higienizacao-orm-entity';
import { StatusHigienizacaoOrmEntity } from '../../../status-higienizacao/infraestructure/orm/status-higienizacao-orm-entity';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';

export interface CleaningBedDto {
  id: number;
  number: string;
  unitId: number;
  unitName?: string;
  status: string;
  statusLeitoId: number;
  lastDischargeDate?: Date | null;
  cleaningStartedAt?: Date | null;
  cleaningEndedAt?: Date | null;
  cleanedByUserId?: number | null;
}

@Injectable()
export class HigienizacaoService {
  constructor(
    @InjectRepository(LeitoOrmEntity)
    private readonly leitoRepository: Repository<LeitoOrmEntity>,
    @InjectRepository(StatusLeitoOrmEntity)
    private readonly statusLeitoRepository: Repository<StatusLeitoOrmEntity>,
    @InjectRepository(HigienizacaoOrmEntity)
    private readonly higienizacaoRepository: Repository<HigienizacaoOrmEntity>,
    @InjectRepository(StatusHigienizacaoOrmEntity)
    private readonly statusHigienizacaoRepository: Repository<StatusHigienizacaoOrmEntity>,
    @InjectRepository(InternacaoOrmEntity)
    private readonly internacaoRepository: Repository<InternacaoOrmEntity>,
  ) {}

  private async getOrCreateStatusLeito(descricao: string): Promise<StatusLeitoOrmEntity> {
    const descLower = descricao.toLowerCase();
    let status = await this.statusLeitoRepository.findOne({
      where: { descricao: descLower },
    });

    if (!status) {
      status = await this.statusLeitoRepository.save(
        this.statusLeitoRepository.create({ descricao: descLower }),
      );
    }
    return status;
  }

  private async getOrCreateStatusHigienizacao(descricao: string): Promise<StatusHigienizacaoOrmEntity> {
    const descLower = descricao.toLowerCase();
    let status = await this.statusHigienizacaoRepository.findOne({
      where: { descricao: descLower },
    });

    if (!status) {
      status = await this.statusHigienizacaoRepository.save(
        this.statusHigienizacaoRepository.create({ descricao: descLower }),
      );
    }
    return status;
  }

  async findAllBedsForCleaning(unitId?: number): Promise<CleaningBedDto[]> {
    const query = this.leitoRepository
      .createQueryBuilder('leito')
      .leftJoinAndSelect('leito.unidade', 'unidade')
      .leftJoinAndSelect('leito.statusLeito', 'statusLeito')
      .leftJoinAndSelect('leito.higienizacoes', 'higienizacao')
      .leftJoinAndSelect('higienizacao.realizadoPorUsuario', 'usuario')
      .orderBy('leito.numero', 'ASC')
      .addOrderBy('higienizacao.dataInicio', 'DESC');

    if (unitId) {
      query.where('leito.unidadeId = :unitId', { unitId });
    }

    const leitos = await query.getMany();

    const leitoIds = leitos.map((l) => l.id);
    let latestDischargesMap = new Map<number, Date>();

    if (leitoIds.length > 0) {
      const internacoes = await this.internacaoRepository.find({
        where: leitoIds.map((id) => ({ leitoId: id })),
        order: { dataSaida: 'DESC' },
      });

      for (const item of internacoes) {
        if (item.leitoId && item.dataSaida && !latestDischargesMap.has(item.leitoId)) {
          latestDischargesMap.set(item.leitoId, item.dataSaida);
        }
      }
    }

    return leitos.map((leito) => {
      const latestHig = leito.higienizacoes && leito.higienizacoes.length > 0 ? leito.higienizacoes[0] : null;
      const descr = leito.statusLeito?.descricao?.toLowerCase() ?? 'livre';

      let displayStatus = 'Livre';
      if (descr === 'esperando higienização' || descr === 'aguardando higienização' || descr === 'aguardando limpeza') {
        displayStatus = 'Esperando Higienização';
      } else if (descr === 'em higienização' || descr === 'em limpeza') {
        displayStatus = 'Em Higienização';
      } else if (descr === 'ocupado') {
        displayStatus = 'Ocupado';
      } else if (descr === 'bloqueado') {
        displayStatus = 'Bloqueado';
      }

      return {
        id: leito.id,
        number: leito.numero,
        unitId: leito.unidadeId,
        unitName: leito.unidade?.nome,
        status: displayStatus,
        statusLeitoId: leito.statusLeitoId,
        lastDischargeDate: latestDischargesMap.get(leito.id) ?? null,
        cleaningStartedAt: latestHig?.dataInicio ?? null,
        cleaningEndedAt: latestHig?.dataFim ?? null,
        cleanedByUserId: latestHig?.realizadoPorUsuarioId ?? null,
      };
    });
  }

  async startCleaning(leitoId: number, usuarioId?: number): Promise<CleaningBedDto> {
    const leito = await this.leitoRepository.findOne({
      where: { id: leitoId },
      relations: { statusLeito: true, unidade: true },
    });

    if (!leito) {
      throw new NotFoundException('Leito não encontrado');
    }

    const statusEmHig = await this.getOrCreateStatusLeito('em higienização');
    leito.statusLeitoId = statusEmHig.id;
    leito.statusLeito = statusEmHig;
    await this.leitoRepository.save(leito);

    const statusHigEntity = await this.getOrCreateStatusHigienizacao('em andamento');

    const higienizacao = this.higienizacaoRepository.create({
      leitoId: leito.id,
      statusHigienizacaoId: statusHigEntity.id,
      dataInicio: new Date(),
      dataFim: null,
      realizadoPorUsuarioId: usuarioId ?? null,
    });

    await this.higienizacaoRepository.save(higienizacao);

    const result = await this.findAllBedsForCleaning();
    const updated = result.find((b) => b.id === leitoId);
    if (!updated) {
      throw new NotFoundException('Erro ao atualizar estado do leito.');
    }
    return updated;
  }

  async finishCleaning(leitoId: number, usuarioId?: number): Promise<CleaningBedDto> {
    const leito = await this.leitoRepository.findOne({
      where: { id: leitoId },
      relations: { statusLeito: true, unidade: true },
    });

    if (!leito) {
      throw new NotFoundException('Leito não encontrado');
    }

    const statusLivre = await this.getOrCreateStatusLeito('livre');
    leito.statusLeitoId = statusLivre.id;
    leito.statusLeito = statusLivre;
    await this.leitoRepository.save(leito);

    const latestHig = await this.higienizacaoRepository.findOne({
      where: { leitoId: leito.id },
      order: { dataInicio: 'DESC' },
    });

    const statusHigConcluido = await this.getOrCreateStatusHigienizacao('concluida');

    if (latestHig) {
      latestHig.dataFim = new Date();
      latestHig.statusHigienizacaoId = statusHigConcluido.id;
      if (usuarioId) {
        latestHig.realizadoPorUsuarioId = usuarioId;
      }
      await this.higienizacaoRepository.save(latestHig);
    } else {
      await this.higienizacaoRepository.save(
        this.higienizacaoRepository.create({
          leitoId: leito.id,
          statusHigienizacaoId: statusHigConcluido.id,
          dataInicio: new Date(),
          dataFim: new Date(),
          realizadoPorUsuarioId: usuarioId ?? null,
        }),
      );
    }

    const result = await this.findAllBedsForCleaning();
    const updated = result.find((b) => b.id === leitoId);
    if (!updated) {
      throw new NotFoundException('Erro ao atualizar estado do leito.');
    }
    return updated;
  }

  async registerDischarge(leitoId: number): Promise<CleaningBedDto> {
    const leito = await this.leitoRepository.findOne({
      where: { id: leitoId },
      relations: { statusLeito: true, unidade: true },
    });

    if (!leito) {
      throw new NotFoundException('Leito não encontrado');
    }

    const activeAdmission = await this.internacaoRepository.findOne({
      where: { leitoId: leito.id, dataSaida: IsNull() },
      order: { dataEntrada: 'DESC' },
    });

    if (activeAdmission) {
      activeAdmission.dataSaida = new Date();
      await this.internacaoRepository.save(activeAdmission);
    }

    const statusEsperando = await this.getOrCreateStatusLeito('esperando higienização');
    leito.statusLeitoId = statusEsperando.id;
    leito.statusLeito = statusEsperando;
    await this.leitoRepository.save(leito);

    const result = await this.findAllBedsForCleaning();
    const updated = result.find((b) => b.id === leitoId);
    if (!updated) {
      throw new NotFoundException('Erro ao registrar alta.');
    }
    return updated;
  }
}
