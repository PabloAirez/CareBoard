import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLeitoUseCase } from './application/use-cases/create-leito-use-case';
import { DeleteLeitoUseCase } from './application/use-cases/delete-leito-use-case';
import { FindAllLeitosUseCase } from './application/use-cases/find-all-leito-use-case';
import { FindLeitoByIdUseCase } from './application/use-cases/find-leito-by-id-use-case';
import { FindLeitosByUnidadeIdUseCase } from './application/use-cases/find-leitos-by-unidade-id-use-case';
import { UpdateLeitoUseCase } from './application/use-cases/update-leito-use-case';
import { LeitoRepository } from './domain/repositories/leito.repository';
import { LeitoOrmEntity } from './infraestructure/orm/leito-orm-entity';
import { LeitoRepositoryImpl } from './infraestructure/repositories/leito.repository.impl';
import { LeitoController } from './presentation/leito.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeitoOrmEntity])],
  controllers: [LeitoController],
  providers: [
    CreateLeitoUseCase,
    FindAllLeitosUseCase,
    FindLeitosByUnidadeIdUseCase,
    FindLeitoByIdUseCase,
    UpdateLeitoUseCase,
    DeleteLeitoUseCase,
    {
      provide: LeitoRepository,
      useClass: LeitoRepositoryImpl,
    },
  ],
})
export class LeitoModule {}
