import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUnidadeUseCase } from './application/use-cases/create-unidade-use-case';
import { DeleteUnidadeUseCase } from './application/use-cases/delete-unidade-use-case';
import { FindAllUnidadesUseCase } from './application/use-cases/find-all-unidade-use-case';
import { FindUnidadeByIdUseCase } from './application/use-cases/find-unidade-by-id-use-case';
import { UpdateUnidadeUseCase } from './application/use-cases/update-unidade-use-case';
import { UnidadeRepository } from './domain/repositories/unidade.repository';
import { UnidadeOrmEntity } from './infraestructure/orm/unidade-orm-entity';
import { UnidadeRepositoryImpl } from './infraestructure/repositories/unidade.repository.impl';
import { UnidadeController } from './presentation/unidade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadeOrmEntity])],
  controllers: [UnidadeController],
  providers: [
    CreateUnidadeUseCase,
    FindAllUnidadesUseCase,
    FindUnidadeByIdUseCase,
    UpdateUnidadeUseCase,
    DeleteUnidadeUseCase,
    {
      provide: UnidadeRepository,
      useClass: UnidadeRepositoryImpl,
    },
  ],
})
export class UnidadeModule {}
