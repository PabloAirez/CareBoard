import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';
import { StatusLeitoOrmEntity } from '../status-leito/infraestructure/orm/status-leito-orm-entity';
import { HigienizacaoOrmEntity } from './infraestructure/orm/higienizacao-orm-entity';
import { StatusHigienizacaoOrmEntity } from '../status-higienizacao/infraestructure/orm/status-higienizacao-orm-entity';
import { InternacaoOrmEntity } from '../internacao/infraestructure/orm/internacao-orm-entity';
import { HigienizacaoService } from './application/services/higienizacao.service';
import { HigienizacaoController } from './presentation/higienizacao.controller';
import { SighModule } from '../sigh/sigh.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeitoOrmEntity,
      StatusLeitoOrmEntity,
      HigienizacaoOrmEntity,
      StatusHigienizacaoOrmEntity,
      InternacaoOrmEntity,
    ]),
    SighModule,
  ],
  controllers: [HigienizacaoController],
  providers: [HigienizacaoService],
  exports: [HigienizacaoService],
})
export class HigienizacaoModule {}
