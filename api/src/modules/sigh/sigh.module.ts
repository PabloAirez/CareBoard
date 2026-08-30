import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegracaoBancoOrmEntity } from '../integracao-banco/infraestructure/orm/integracao-banco-orm-entity';
import { SistemaExternoOrmEntity } from '../sistema-externo/infraestructure/orm/sistema-externo-orm-entity';
import { HospitalOrmEntity } from '../hospital/infraestructure/orm/hospital-orm-entity';
import { UnidadeOrmEntity } from '../unidade/infraestructure/orm/unidade-orm-entity';
import { StatusLeitoOrmEntity } from '../status-leito/infraestructure/orm/status-leito-orm-entity';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';
import { PacienteOrmEntity } from '../paciente/infraestructure/orm/paciente-orm-entity';
import { StatusInternacaoOrmEntity } from '../status-internacao/infraestructure/orm/status-internacao-orm-entity';
import { InternacaoOrmEntity } from '../internacao/infraestructure/orm/internacao-orm-entity';
import { SinaisVitaisOrmEntity } from '../sinais-vitais/infraestructure/orm/sinais-vitais-orm-entity';
import { TipoUsuarioOrmEntity } from '../tipo-usuario/infraestructure/orm/tipo-usuario-orm-entity';
import { UsuarioOrmEntity } from '../usuario/infraestructure/orm/usuario-orm-entity';

import { EncryptionService } from './application/services/encryption.service';
import { SighConnectionService } from './application/services/sigh-connection.service';
import { SighSyncService } from './application/services/sigh-sync.service';
import { SighGateway } from './presentation/sigh.gateway';
import { IntegracaoBancoController } from './presentation/integracao-banco.controller';
import { ConfigController } from './presentation/config.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IntegracaoBancoOrmEntity,
      SistemaExternoOrmEntity,
      HospitalOrmEntity,
      UnidadeOrmEntity,
      StatusLeitoOrmEntity,
      LeitoOrmEntity,
      PacienteOrmEntity,
      StatusInternacaoOrmEntity,
      InternacaoOrmEntity,
      SinaisVitaisOrmEntity,
      TipoUsuarioOrmEntity,
      UsuarioOrmEntity,
    ]),
  ],
  controllers: [IntegracaoBancoController, ConfigController],
  providers: [
    EncryptionService,
    SighConnectionService,
    SighSyncService,
    SighGateway,
  ],
  exports: [SighSyncService, SighGateway],
})
export class SighModule {}
