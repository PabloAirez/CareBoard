import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusDemandaOrmEntity } from '../status-demanda/infraestructure/orm/status-demanda-orm-entity';
import { TipoDemandaOrmEntity } from '../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { InternacaoOrmEntity } from '../internacao/infraestructure/orm/internacao-orm-entity';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';
import { PacienteOrmEntity } from '../paciente/infraestructure/orm/paciente-orm-entity';
import { StatusInternacaoOrmEntity } from '../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { PendingDemandService } from './application/services/pending-demand.service';
import { DemandaOrmEntity } from './infraestructure/orm/demanda-orm-entity';
import { DemandaController } from './presentation/demanda.controller';
import { PendingDemandGateway } from './presentation/realtime/pending-demand.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DemandaOrmEntity,
      TipoDemandaOrmEntity,
      StatusDemandaOrmEntity,
      InternacaoOrmEntity,
      LeitoOrmEntity,
      PacienteOrmEntity,
      StatusInternacaoOrmEntity,
    ]),
  ],
  controllers: [DemandaController],
  providers: [PendingDemandService, PendingDemandGateway],
})
export class DemandaModule {}
