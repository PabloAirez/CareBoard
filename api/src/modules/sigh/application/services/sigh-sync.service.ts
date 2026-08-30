import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegracaoBancoOrmEntity } from '../../../integracao-banco/infraestructure/orm/integracao-banco-orm-entity';
import { UnidadeOrmEntity } from '../../../unidade/infraestructure/orm/unidade-orm-entity';
import { StatusLeitoOrmEntity } from '../../../status-leito/infraestructure/orm/status-leito-orm-entity';
import { LeitoOrmEntity } from '../../../leito/infraestructure/orm/leito-orm-entity';
import { PacienteOrmEntity } from '../../../paciente/infraestructure/orm/paciente-orm-entity';
import { StatusInternacaoOrmEntity } from '../../../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';
import { SinaisVitaisOrmEntity } from '../../../sinais-vitais/infraestructure/orm/sinais-vitais-orm-entity';
import { TipoUsuarioOrmEntity } from '../../../tipo-usuario/infraestructure/orm/tipo-usuario-orm-entity';
import { UsuarioOrmEntity } from '../../../usuario/infraestructure/orm/usuario-orm-entity';

import { EncryptionService } from './encryption.service';
import { SighConnectionService } from './sigh-connection.service';
import { SIGH_QUERIES } from '../queries/sigh.queries';
import { SighGateway } from '../../presentation/sigh.gateway';

function anonymizeName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.map((p) => p[0].toUpperCase()).join('.');
}

@Injectable()
export class SighSyncService {
  private readonly logger = new Logger(SighSyncService.name);

  constructor(
    @InjectRepository(IntegracaoBancoOrmEntity)
    private readonly integracaoRepo: Repository<IntegracaoBancoOrmEntity>,
    @InjectRepository(UnidadeOrmEntity)
    private readonly unidadeRepo: Repository<UnidadeOrmEntity>,
    @InjectRepository(StatusLeitoOrmEntity)
    private readonly statusLeitoRepo: Repository<StatusLeitoOrmEntity>,
    @InjectRepository(LeitoOrmEntity)
    private readonly leitoRepo: Repository<LeitoOrmEntity>,
    @InjectRepository(PacienteOrmEntity)
    private readonly pacienteRepo: Repository<PacienteOrmEntity>,
    @InjectRepository(StatusInternacaoOrmEntity)
    private readonly statusInternacaoRepo: Repository<StatusInternacaoOrmEntity>,
    @InjectRepository(InternacaoOrmEntity)
    private readonly internacaoRepo: Repository<InternacaoOrmEntity>,
    @InjectRepository(SinaisVitaisOrmEntity)
    private readonly sinaisVitaisRepo: Repository<SinaisVitaisOrmEntity>,
    @InjectRepository(TipoUsuarioOrmEntity)
    private readonly tipoUsuarioRepo: Repository<TipoUsuarioOrmEntity>,
    @InjectRepository(UsuarioOrmEntity)
    private readonly usuarioRepo: Repository<UsuarioOrmEntity>,

    private readonly encryptionService: EncryptionService,
    private readonly connectionService: SighConnectionService,
    private readonly sighGateway: SighGateway,
  ) {}

  @Cron('*/2 * * * *')
  async handleCronSync() {
    this.logger.log('Iniciando sincronizacao periodica com SIGH...');
    await this.syncAll();
  }

  async syncAll() {
    const integracoes = await this.integracaoRepo.find({
      relations: { hospital: true, sistemaExterno: true },
    });

    if (integracoes.length === 0) {
      this.logger.log('Nenhuma integracao de banco configurada.');
      return;
    }

    for (const integracao of integracoes) {
      try {
        const senha = this.encryptionService.decrypt(
          integracao.senhaCriptografada,
          integracao.ivCriptografia,
          integracao.authTag,
        );

        const credentials = {
          host: integracao.host,
          porta: integracao.porta,
          nomeBanco: integracao.nomeBanco,
          usuario: integracao.usuario,
          senha,
        };

        const hospitalId = integracao.hospitalId;
        const summary = await this.syncHospitalData(hospitalId, credentials);

        this.logger.log(`Sincronizacao concluida para hospital ${hospitalId}: ${JSON.stringify(summary)}`);
        this.sighGateway.notifySyncComplete(summary);
      } catch (error) {
        this.logger.error(`Erro ao sincronizar hospital ID ${integracao.hospitalId}: ${(error as Error).message}`);
      }
    }
  }

  private async syncHospitalData(hospitalId: number, credentials: any) {
    const summary = {
      unidades: 0,
      leitos: 0,
      pacientes: 0,
      internacoes: 0,
      sinaisVitais: 0,
    };

    // 1. Status de Leito Padrão
    let statusLivre = await this.statusLeitoRepo.findOne({ where: { descricao: 'livre' } });
    if (!statusLivre) {
      statusLivre = await this.statusLeitoRepo.save(this.statusLeitoRepo.create({ descricao: 'livre' }));
    }

    let statusOcupado = await this.statusLeitoRepo.findOne({ where: { descricao: 'ocupado' } });
    if (!statusOcupado) {
      statusOcupado = await this.statusLeitoRepo.save(this.statusLeitoRepo.create({ descricao: 'ocupado' }));
    }

    // Tipo de Usuário "Leito" para registro de demandas
    let tipoLeito = await this.tipoUsuarioRepo.findOne({ where: { descricao: 'Leito' } });
    if (!tipoLeito) {
      tipoLeito = await this.tipoUsuarioRepo.findOne({ where: { descricao: 'leito' } });
    }
    if (!tipoLeito) {
      tipoLeito = await this.tipoUsuarioRepo.save(this.tipoUsuarioRepo.create({ descricao: 'Leito' }));
    }

    // 2. Sincronizar Unidades
    const unidadesSigh = await this.connectionService.executeQuery<{
      id_unidade: number | string;
      nm_unidade: string;
    }>(credentials, SIGH_QUERIES.GET_UNIDADES);

    const unidadeMapByIdExt = new Map<string, UnidadeOrmEntity>();
    const unidadeMapByName = new Map<string, UnidadeOrmEntity>();

    for (const row of unidadesSigh) {
      if (!row.nm_unidade) continue;
      const extId = row.id_unidade ? String(row.id_unidade) : null;

      let unidade = extId
        ? await this.unidadeRepo.findOne({ where: { idSistemaExterno: extId, hospitalId } })
        : null;

      if (!unidade) {
        unidade = await this.unidadeRepo.findOne({ where: { nome: row.nm_unidade, hospitalId } });
      }

      if (!unidade) {
        unidade = await this.unidadeRepo.save(
          this.unidadeRepo.create({
            nome: row.nm_unidade,
            hospitalId,
            idSistemaExterno: extId,
          }),
        );
        summary.unidades++;
      } else if (extId && unidade.idSistemaExterno !== extId) {
        unidade.idSistemaExterno = extId;
        await this.unidadeRepo.save(unidade);
      }

      if (extId) {
        unidadeMapByIdExt.set(extId, unidade);
      }
      unidadeMapByName.set(row.nm_unidade, unidade);
    }

    // 3. Sincronizar Leitos & Garantir Usuario de Leito
    try {
      const leitosSigh = await this.connectionService.executeQuery<{
        id_leito: number | string;
        numero_leito: string;
        status_leito: string;
        id_unidade: number | string;
        nm_unidade: string;
      }>(credentials, SIGH_QUERIES.GET_LEITOS);

      const leitoMapByIdExt = new Map<string, LeitoOrmEntity>();
      const leitoMapByNumUnit = new Map<string, LeitoOrmEntity>();

      for (const row of leitosSigh) {
        if (!row.numero_leito) continue;
        const unitExtId = row.id_unidade ? String(row.id_unidade) : null;
        const unidade = (unitExtId ? unidadeMapByIdExt.get(unitExtId) : null) || unidadeMapByName.get(row.nm_unidade);
        if (!unidade) continue;

        const extLeitoId = row.id_leito ? String(row.id_leito) : null;

        let descrStatus = (row.status_leito || 'livre').toLowerCase();
        let statusLeito = await this.statusLeitoRepo.findOne({ where: { descricao: descrStatus } });
        if (!statusLeito) {
          statusLeito = await this.statusLeitoRepo.save(this.statusLeitoRepo.create({ descricao: descrStatus }));
        }

        let leito = extLeitoId
          ? await this.leitoRepo.findOne({ where: { idSistemaExterno: extLeitoId, unidadeId: unidade.id } })
          : null;

        if (!leito) {
          leito = await this.leitoRepo.findOne({ where: { numero: row.numero_leito, unidadeId: unidade.id } });
        }

        if (!leito) {
          leito = await this.leitoRepo.save(
            this.leitoRepo.create({
              numero: row.numero_leito,
              unidadeId: unidade.id,
              statusLeitoId: statusLeito.id,
              idSistemaExterno: extLeitoId,
            }),
          );
          summary.leitos++;
        } else {
          let updated = false;
          if (extLeitoId && leito.idSistemaExterno !== extLeitoId) {
            leito.idSistemaExterno = extLeitoId;
            updated = true;
          }
          if (leito.statusLeitoId !== statusLeito.id) {
            leito.statusLeitoId = statusLeito.id;
            updated = true;
          }
          if (updated) {
            await this.leitoRepo.save(leito);
          }
        }

        // Criar/Garantir Usuario do Leito tipo 'Leito' com senha 'Admin@careboard'
        let userLeito = await this.usuarioRepo.findOne({
          where: { nome: leito.numero, hospitalId },
        });

        if (!userLeito) {
          await this.usuarioRepo.save(
            this.usuarioRepo.create({
              nome: leito.numero,
              senha: 'Admin@careboard',
              tipoUsuarioId: tipoLeito.id,
              hospitalId,
            }),
          );
        } else {
          let userUpdated = false;
          if (userLeito.senha !== 'Admin@careboard') {
            userLeito.senha = 'Admin@careboard';
            userUpdated = true;
          }
          if (userLeito.tipoUsuarioId !== tipoLeito.id) {
            userLeito.tipoUsuarioId = tipoLeito.id;
            userUpdated = true;
          }
          if (userUpdated) {
            await this.usuarioRepo.save(userLeito);
          }
        }

        if (extLeitoId) {
          leitoMapByIdExt.set(extLeitoId, leito);
        }
        leitoMapByNumUnit.set(`${row.numero_leito}_${unidade.id}`, leito);
      }
    } catch (err) {
      this.logger.warn(`Sincronizacao de leitos parcial/ignorada: ${(err as Error).message}`);
    }

    // Ensure all existing beds also have a bed user registered
    const allLeitos = await this.leitoRepo.find({ where: { unidade: { hospitalId } }, relations: { unidade: true } });
    for (const leito of allLeitos) {
      let userLeito = await this.usuarioRepo.findOne({
        where: { nome: leito.numero, hospitalId },
      });

      if (!userLeito) {
        await this.usuarioRepo.save(
          this.usuarioRepo.create({
            nome: leito.numero,
            senha: 'Admin@careboard',
            tipoUsuarioId: tipoLeito.id,
            hospitalId,
          }),
        );
      }
    }

    // 4. Sincronizar Pacientes e Internacoes Ativas
    try {
      const pacIntSigh = await this.connectionService.executeQuery<{
        id_fia: number | string;
        id_paciente: number | string;
        nm_paciente: string;
        data_nascimento: Date | string | null;
        nm_sexo: string | null;
        cod_motivo_isolamento: number | string | null;
        data_atendimento: Date | string;
        data_alta: Date | string | null;
        descr_situacao_atendimento: string | null;
        id_unidade: number | string;
        nm_unidade: string;
        id_leito: number | string;
        numero_leito: string;
      }>(credentials, SIGH_QUERIES.GET_PACIENTES_INTERNACOES);

      const occupiedLeitoIds = new Set<number>();

      for (const row of pacIntSigh) {
        if (!row.nm_paciente) continue;

        const extPacId = row.id_paciente ? String(row.id_paciente) : null;
        const anonName = anonymizeName(row.nm_paciente);
        const dataNasc = row.data_nascimento ? new Date(row.data_nascimento) : null;
        const sexoChar = row.nm_sexo ? row.nm_sexo.trim().charAt(0).toUpperCase() : null;
        const temDoencaContagiosa = row.cod_motivo_isolamento !== null && row.cod_motivo_isolamento !== undefined && String(row.cod_motivo_isolamento) !== '0';

        let paciente = extPacId
          ? await this.pacienteRepo.findOne({ where: { idSistemaExterno: extPacId } })
          : null;

        if (!paciente) {
          paciente = await this.pacienteRepo.findOne({ where: { nome: anonName } });
        }

        if (!paciente) {
          paciente = await this.pacienteRepo.save(
            this.pacienteRepo.create({
              nome: anonName,
              dataNascimento: dataNasc,
              sexo: sexoChar,
              temDoencaContagiosa,
              idSistemaExterno: extPacId,
            }),
          );
          summary.pacientes++;
        } else {
          let updated = false;
          if (paciente.nome !== anonName) {
            paciente.nome = anonName;
            updated = true;
          }
          if (extPacId && paciente.idSistemaExterno !== extPacId) {
            paciente.idSistemaExterno = extPacId;
            updated = true;
          }
          if (paciente.temDoencaContagiosa !== temDoencaContagiosa) {
            paciente.temDoencaContagiosa = temDoencaContagiosa;
            updated = true;
          }
          if (sexoChar && paciente.sexo !== sexoChar) {
            paciente.sexo = sexoChar;
            updated = true;
          }
          if (updated) {
            await this.pacienteRepo.save(paciente);
          }
        }

        // Identificar leito
        const extLeitoId = row.id_leito ? String(row.id_leito) : null;
        const unitExtId = row.id_unidade ? String(row.id_unidade) : null;
        const unidade = (unitExtId ? unidadeMapByIdExt.get(unitExtId) : null) || unidadeMapByName.get(row.nm_unidade);
        
        const leito = (extLeitoId ? await this.leitoRepo.findOne({ where: { idSistemaExterno: extLeitoId } }) : null) || (unidade ? await this.leitoRepo.findOne({ where: { numero: row.numero_leito, unidadeId: unidade.id } }) : null);

        if (!leito) continue;

        occupiedLeitoIds.add(leito.id);

        const extFiaId = row.id_fia ? String(row.id_fia) : null;
        const descrStatusInt = (row.descr_situacao_atendimento || 'ativa').toLowerCase();

        let statusInt = await this.statusInternacaoRepo.findOne({ where: { descricao: descrStatusInt } });
        if (!statusInt) {
          statusInt = await this.statusInternacaoRepo.save(this.statusInternacaoRepo.create({ descricao: descrStatusInt }));
        }

        const dataEntrada = row.data_atendimento ? new Date(row.data_atendimento) : new Date();
        const dataSaida = row.data_alta ? new Date(row.data_alta) : null;

        let internacao = extFiaId
          ? await this.internacaoRepo.findOne({ where: { idSistemaExterno: extFiaId } })
          : null;

        if (!internacao) {
          internacao = await this.internacaoRepo.findOne({ where: { pacienteId: paciente.id, leitoId: leito.id, dataEntrada } });
        }

        if (!internacao) {
          await this.internacaoRepo.save(
            this.internacaoRepo.create({
              pacienteId: paciente.id,
              leitoId: leito.id,
              dataEntrada,
              dataSaida,
              statusInternacaoId: statusInt.id,
              idSistemaExterno: extFiaId,
            }),
          );
          summary.internacoes++;
        } else {
          let updated = false;
          if (extFiaId && internacao.idSistemaExterno !== extFiaId) {
            internacao.idSistemaExterno = extFiaId;
            updated = true;
          }
          if (dataSaida && internacao.dataSaida?.getTime() !== dataSaida.getTime()) {
            internacao.dataSaida = dataSaida;
            updated = true;
          }
          if (internacao.statusInternacaoId !== statusInt.id) {
            internacao.statusInternacaoId = statusInt.id;
            updated = true;
          }
          if (updated) {
            await this.internacaoRepo.save(internacao);
          }
        }
      }

      // Atualizar status de leitos ocupados vs livres
      const allLeitosToUpdate = await this.leitoRepo.find();
      for (const leito of allLeitosToUpdate) {
        if (occupiedLeitoIds.has(leito.id)) {
          if (leito.statusLeitoId !== statusOcupado.id) {
            leito.statusLeitoId = statusOcupado.id;
            await this.leitoRepo.save(leito);
          }
        } else {
          if (leito.statusLeitoId === statusOcupado.id) {
            leito.statusLeitoId = statusLivre.id;
            await this.leitoRepo.save(leito);
          }
        }
      }
    } catch (err) {
      this.logger.warn(`Sincronizacao de pacientes/internacoes parcial: ${(err as Error).message}`);
    }

    // 5. Sincronizar Sinais Vitais
    try {
      const sinaisSigh = await this.connectionService.executeQuery<{
        id_observacao: number | string;
        id_paciente: number | string;
        nm_paciente: string;
        data_observacao: Date | string;
        hora_observacao: string;
        temperatura: number | string | null;
        fc: number | null;
        fr: number | null;
        pas: number | null;
        pad: number | null;
        sensorio: string | null;
      }>(credentials, SIGH_QUERIES.GET_SINAIS_VITAIS);

      for (const row of sinaisSigh) {
        if (!row.nm_paciente) continue;
        const extPacId = row.id_paciente ? String(row.id_paciente) : null;
        const anonName = anonymizeName(row.nm_paciente);

        const paciente = extPacId
          ? await this.pacienteRepo.findOne({ where: { idSistemaExterno: extPacId } })
          : await this.pacienteRepo.findOne({ where: { nome: anonName } });

        if (!paciente) continue;

        const extObsId = row.id_observacao ? String(row.id_observacao) : null;

        let dataHora: Date;
        if (typeof row.data_observacao === 'string') {
          const timePart = row.hora_observacao || '00:00:00';
          dataHora = new Date(`${row.data_observacao.substring(0, 10)}T${timePart}`);
        } else if (row.data_observacao instanceof Date) {
          dataHora = row.data_observacao;
        } else {
          dataHora = new Date();
        }

        let sinalVital = extObsId
          ? await this.sinaisVitaisRepo.findOne({ where: { idSistemaExterno: extObsId } })
          : await this.sinaisVitaisRepo.findOne({ where: { pacienteId: paciente.id, dataHora } });

        if (!sinalVital) {
          await this.sinaisVitaisRepo.save(
            this.sinaisVitaisRepo.create({
              pacienteId: paciente.id,
              dataHora,
              temperatura: row.temperatura ? String(row.temperatura) : null,
              frequenciaCardiaca: row.fc || null,
              frequenciaRespiratoria: row.fr || null,
              pressaoSistolica: row.pas || null,
              pressaoDiastolica: row.pad || null,
              nivelConsciencia: row.sensorio || null,
              idSistemaExterno: extObsId,
            }),
          );
          summary.sinaisVitais++;
        }
      }
    } catch (err) {
      this.logger.warn(`Sinais vitais nao sincronizados: ${(err as Error).message}`);
    }

    return summary;
  }
}
