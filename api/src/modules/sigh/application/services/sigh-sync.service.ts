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
import { DemandaOrmEntity } from '../../../demanda/infraestructure/orm/demanda-orm-entity';
import { TipoDemandaOrmEntity } from '../../../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { StatusDemandaOrmEntity } from '../../../status-demanda/infraestructure/orm/status-demanda-orm-entity';

import { EncryptionService } from './encryption.service';
import { SighConnectionService } from './sigh-connection.service';
import { SIGH_QUERIES } from '../queries/sigh.queries';
import { SighGateway } from '../../presentation/sigh.gateway';

function anonymizeName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.map((p) => p[0].toUpperCase()).join('.');
}

function parseAprazamentoTimes(text?: string | null): string[] {
  if (!text) return [];
  const times: string[] = [];
  const regex = /(\d{1,2})[:h](\d{2})/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const hh = match[1].padStart(2, '0');
    const mm = match[2];
    times.push(`${hh}:${mm}`);
  }
  return [...new Set(times)];
}

interface RunningVitals {
  fc: number | null;
  fr: number | null;
  pas: number | null;
  pad: number | null;
  temp: number | null;
  sensorio: string | null;
}

function calculateMewsScore(vitals: RunningVitals): number {
  let score = 0;

  // PAS
  if (vitals.pas != null && vitals.pas > 0) {
    const pas = vitals.pas;
    if (pas <= 70) score += 3;
    else if (pas <= 80) score += 2;
    else if (pas <= 100) score += 1;
    else if (pas <= 199) score += 0;
    else score += 2; // >= 200
  }

  // FC
  if (vitals.fc != null && vitals.fc > 0) {
    const fc = vitals.fc;
    if (fc <= 40) score += 3;
    else if (fc <= 50) score += 1;
    else if (fc <= 100) score += 0;
    else if (fc <= 110) score += 1;
    else if (fc <= 129) score += 2;
    else score += 3; // >= 130
  }

  // FR
  if (vitals.fr != null && vitals.fr > 0) {
    const fr = vitals.fr;
    if (fr <= 8) score += 2;
    else if (fr <= 14) score += 1;
    else if (fr <= 20) score += 0;
    else if (fr <= 29) score += 1;
    else score += 3; // >= 30
  }

  // Temp
  if (vitals.temp != null && vitals.temp > 0) {
    const temp = vitals.temp;
    if (temp <= 35.0) score += 2;
    else if (temp >= 38.5) score += 1;
  }

  // Consciência
  if (vitals.sensorio) {
    const cons = vitals.sensorio.toLowerCase();
    if (cons.includes('voz')) score += 1;
    else if (cons.includes('dor')) score += 2;
    else if (cons.includes('inconsc')) score += 3;
  }

  return score;
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
    @InjectRepository(DemandaOrmEntity)
    private readonly demandaRepo: Repository<DemandaOrmEntity>,
    @InjectRepository(TipoDemandaOrmEntity)
    private readonly tipoDemandaRepo: Repository<TipoDemandaOrmEntity>,
    @InjectRepository(StatusDemandaOrmEntity)
    private readonly statusDemandaRepo: Repository<StatusDemandaOrmEntity>,

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
      aprazamentos: 0,
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

    // Tipo de Demanda e Status para Aprazamentos
    let tipoMedicacao = await this.tipoDemandaRepo.findOne({ where: { descricao: 'Medicação' } });
    if (!tipoMedicacao) {
      tipoMedicacao = await this.tipoDemandaRepo.save(this.tipoDemandaRepo.create({ descricao: 'Medicação' }));
    }

    let statusPendente = await this.statusDemandaRepo.findOne({ where: { descricao: 'pendente' } });
    if (!statusPendente) {
      statusPendente = await this.statusDemandaRepo.save(this.statusDemandaRepo.create({ descricao: 'pendente' }));
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

    // 5. Sincronizar Sinais Vitais com Forward-Fill por Internacao (cod_fia) e MEWS
    try {
      const sinaisSigh = await this.connectionService.executeQuery<{
        id_observacao: number | string;
        cod_fia: number | string;
        id_paciente: number | string;
        nm_paciente: string;
        data_observacao: Date | string;
        hora_observacao: string;
        temperatura: number | string | null;
        fc: number | string | null;
        fr: number | string | null;
        pressao: string | null;
        sensorio: string | null;
      }>(credentials, SIGH_QUERIES.GET_SINAIS_VITAIS);

      const runningVitalsByFia = new Map<string, RunningVitals>();

      for (const row of sinaisSigh) {
        const fiaId = row.cod_fia ? String(row.cod_fia) : null;
        const extPacId = row.id_paciente ? String(row.id_paciente) : null;

        let paciente: PacienteOrmEntity | null = null;
        if (fiaId) {
          const internacao = await this.internacaoRepo.findOne({
            where: { idSistemaExterno: fiaId },
            relations: { paciente: true },
          });
          if (internacao?.paciente) {
            paciente = internacao.paciente;
          }
        }

        if (!paciente && extPacId) {
          paciente = await this.pacienteRepo.findOne({ where: { idSistemaExterno: extPacId } });
        }

        if (!paciente && row.nm_paciente) {
          paciente = await this.pacienteRepo.findOne({ where: { nome: anonymizeName(row.nm_paciente) } });
        }

        if (!paciente) continue;

        const mapKey = fiaId || String(paciente.id);
        let state = runningVitalsByFia.get(mapKey);
        if (!state) {
          state = { fc: null, fr: null, pas: null, pad: null, temp: null, sensorio: null };
          runningVitalsByFia.set(mapKey, state);
        }

        if (row.fc !== null && row.fc !== undefined && Number(row.fc) > 0) {
          state.fc = Math.round(Number(row.fc));
        }

        if (row.fr !== null && row.fr !== undefined && Number(row.fr) > 0) {
          state.fr = Math.round(Number(row.fr));
        }

        if (row.temperatura !== null && row.temperatura !== undefined) {
          const tempVal = Number(String(row.temperatura).replace(',', '.'));
          if (tempVal > 0) {
            state.temp = tempVal;
          }
        }

        if (row.pressao) {
          const match = String(row.pressao).match(/(\d+)\s*[\/xX\\]\s*(\d+)/);
          if (match) {
            state.pas = Number(match[1]);
            state.pad = Number(match[2]);
          }
        }

        if (row.sensorio) {
          const sensUpper = String(row.sensorio).trim().toUpperCase();
          if (sensUpper === 'ALERTA') state.sensorio = 'Alerta';
          else if (sensUpper === 'RESPONDE_A_VOZ') state.sensorio = 'Voz';
          else if (sensUpper === 'RESPONDE_A_DOR') state.sensorio = 'Dor';
          else if (sensUpper === 'IRRESPONSIVO') state.sensorio = 'Inconsciente';
          else if (sensUpper === 'NAO_AVALIADO') state.sensorio = state.sensorio || 'Alerta';
          else state.sensorio = String(row.sensorio);
        }

        const extObsId = row.id_observacao ? String(row.id_observacao) : null;

        let dataHora: Date;
        if (typeof row.data_observacao === 'string') {
          const timePart = row.hora_observacao || '00:00:00';
          const datePart = row.data_observacao.substring(0, 10);
          dataHora = new Date(`${datePart}T${timePart}`);
        } else if (row.data_observacao instanceof Date) {
          dataHora = row.data_observacao;
        } else {
          dataHora = new Date();
        }

        const mewsScore = calculateMewsScore(state);

        let sinalVital = extObsId
          ? await this.sinaisVitaisRepo.findOne({ where: { idSistemaExterno: extObsId } })
          : await this.sinaisVitaisRepo.findOne({ where: { pacienteId: paciente.id, dataHora } });

        if (!sinalVital) {
          await this.sinaisVitaisRepo.save(
            this.sinaisVitaisRepo.create({
              pacienteId: paciente.id,
              dataHora,
              temperatura: state.temp != null ? String(state.temp) : null,
              frequenciaCardiaca: state.fc,
              frequenciaRespiratoria: state.fr,
              pressaoSistolica: state.pas,
              pressaoDiastolica: state.pad,
              nivelConsciencia: state.sensorio || 'Alerta',
              mewsScore,
              idSistemaExterno: extObsId,
            }),
          );
          summary.sinaisVitais++;
        } else {
          let updated = false;
          if (state.fc != null && sinalVital.frequenciaCardiaca !== state.fc) {
            sinalVital.frequenciaCardiaca = state.fc;
            updated = true;
          }
          if (state.fr != null && sinalVital.frequenciaRespiratoria !== state.fr) {
            sinalVital.frequenciaRespiratoria = state.fr;
            updated = true;
          }
          if (state.pas != null && sinalVital.pressaoSistolica !== state.pas) {
            sinalVital.pressaoSistolica = state.pas;
            updated = true;
          }
          if (state.pad != null && sinalVital.pressaoDiastolica !== state.pad) {
            sinalVital.pressaoDiastolica = state.pad;
            updated = true;
          }
          if (state.temp != null && sinalVital.temperatura !== String(state.temp)) {
            sinalVital.temperatura = String(state.temp);
            updated = true;
          }
          if (state.sensorio && sinalVital.nivelConsciencia !== state.sensorio) {
            sinalVital.nivelConsciencia = state.sensorio;
            updated = true;
          }
          if (sinalVital.mewsScore !== mewsScore) {
            sinalVital.mewsScore = mewsScore;
            updated = true;
          }
          if (updated) {
            await this.sinaisVitaisRepo.save(sinalVital);
          }
        }
      }
    } catch (err) {
      this.logger.warn(`Sinais vitais nao sincronizados: ${(err as Error).message}`);
    }

    // 6. Sincronizar Alertas de Aprazamento de Medicamentos (20 min antes do horario)
    try {
      const aprazamentosSigh = await this.connectionService.executeQuery<{
        id_item: number | string;
        cod_fia: number | string;
        nome_medicamento: string | null;
        horarios_aprazamento: string | null;
        observacao: string | null;
        data_aprazamento: Date | string | null;
        id_leito: number | string | null;
        numero_leito: string | null;
        id_unidade: number | string | null;
      }>(credentials, SIGH_QUERIES.GET_APRAZAMENTOS_MEDICAMENTOS);

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayDateStr = `${year}-${month}-${day}`;

      for (const row of aprazamentosSigh) {
        if (!row.cod_fia) continue;

        const fiaId = String(row.cod_fia);
        const internacao = await this.internacaoRepo.findOne({
          where: { idSistemaExterno: fiaId },
          relations: { leito: true },
        });

        if (!internacao) continue;

        const times = parseAprazamentoTimes(row.horarios_aprazamento);

        for (const timeStr of times) {
          const [hStr, mStr] = timeStr.split(':');
          const schedMinutes = Number(hStr) * 60 + Number(mStr);
          const diffMinutes = schedMinutes - currentMinutes;

          // Janela de alerta: de 20 minutos antes do horario agendado ate 30 minutos depois
          const isInAlertWindow = diffMinutes <= 20 && diffMinutes >= -30;

          if (!isInAlertWindow) continue;

          const itemId = row.id_item ? String(row.id_item) : '0';
          const uniqueKey = `aprazamento_${itemId}_${todayDateStr}_${timeStr}`;

          let demandaExistente = await this.demandaRepo.findOne({
            where: { idSistemaExterno: uniqueKey },
          });

          if (!demandaExistente) {
            const medName = row.nome_medicamento || 'Medicamento';
            const obsText = `Medicação: ${medName} (Horário: ${timeStr})${row.observacao ? ' - Obs: ' + row.observacao : ''}`;

            await this.demandaRepo.save(
              this.demandaRepo.create({
                internacaoId: internacao.id,
                tipoDemandaId: tipoMedicacao.id,
                statusDemandaId: statusPendente.id,
                dataHoraSolicitacao: new Date(),
                observacao: obsText,
                idSistemaExterno: uniqueKey,
              }),
            );
            summary.aprazamentos++;
          }
        }
      }
    } catch (err) {
      this.logger.warn(`Aprazamentos de medicamentos nao sincronizados: ${(err as Error).message}`);
    }

    return summary;
  }
}
