import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { CareboardSeed } from './careboard.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HospitalOrmEntity,
      UnidadeOrmEntity,
      LeitoOrmEntity,
      PacienteOrmEntity,
      InternacaoOrmEntity,
      SinaisVitaisOrmEntity,
      StatusLeitoOrmEntity,
      StatusInternacaoOrmEntity,
      TipoDemandaOrmEntity,
      TipoUsuarioOrmEntity,
      StatusDemandaOrmEntity,
      DemandaOrmEntity,
      UsuarioOrmEntity,
    ]),
  ],
  providers: [CareboardSeed],
})
export class SeedModule {}
