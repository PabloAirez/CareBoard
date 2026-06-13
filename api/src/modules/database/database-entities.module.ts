import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertaOrmEntity } from '../alerta/infraestructure/orm/alerta-orm-entity';
import { DemandaOrmEntity } from '../demanda/infraestructure/orm/demanda-orm-entity';
import { HigienizacaoOrmEntity } from '../higienizacao/infraestructure/orm/higienizacao-orm-entity';
import { HospitalOrmEntity } from '../hospital/infraestructure/orm/hospital-orm-entity';
import { IntegracaoBancoOrmEntity } from '../integracao-banco/infraestructure/orm/integracao-banco-orm-entity';
import { InternacaoOrmEntity } from '../internacao/infraestructure/orm/internacao-orm-entity';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';
import { PacienteOrmEntity } from '../paciente/infraestructure/orm/paciente-orm-entity';
import { SinaisVitaisOrmEntity } from '../sinais-vitais/infraestructure/orm/sinais-vitais-orm-entity';
import { SistemaExternoOrmEntity } from '../sistema-externo/infraestructure/orm/sistema-externo-orm-entity';
import { StatusDemandaOrmEntity } from '../status-demanda/infraestructure/orm/status-demanda-orm-entity';
import { StatusHigienizacaoOrmEntity } from '../status-higienizacao/infraestructure/orm/status-higienizacao-orm-entity';
import { StatusInternacaoOrmEntity } from '../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { StatusLeitoOrmEntity } from '../status-leito/infraestructure/orm/status-leito-orm-entity';
import { TipoAlertaOrmEntity } from '../tipo-alerta/infraestructure/orm/tipo-alerta-orm-entity';
import { TipoDemandaOrmEntity } from '../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { TipoUsuarioOrmEntity } from '../tipo-usuario/infraestructure/orm/tipo-usuario-orm-entity';
import { UnidadeOrmEntity } from '../unidade/infraestructure/orm/unidade-orm-entity';
import { UsuarioOrmEntity } from '../usuario/infraestructure/orm/usuario-orm-entity';

export const databaseOrmEntities = [
  StatusLeitoOrmEntity,
  StatusInternacaoOrmEntity,
  TipoDemandaOrmEntity,
  StatusDemandaOrmEntity,
  TipoAlertaOrmEntity,
  StatusHigienizacaoOrmEntity,
  TipoUsuarioOrmEntity,
  SistemaExternoOrmEntity,
  HospitalOrmEntity,
  UnidadeOrmEntity,
  UsuarioOrmEntity,
  LeitoOrmEntity,
  PacienteOrmEntity,
  InternacaoOrmEntity,
  SinaisVitaisOrmEntity,
  DemandaOrmEntity,
  AlertaOrmEntity,
  HigienizacaoOrmEntity,
  IntegracaoBancoOrmEntity,
];

@Module({
  imports: [TypeOrmModule.forFeature(databaseOrmEntities)],
  exports: [TypeOrmModule],
})
export class DatabaseEntitiesModule {}
