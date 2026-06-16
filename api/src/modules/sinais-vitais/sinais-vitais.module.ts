import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateSinaisVitaisUseCase } from './application/use-cases/create-sinais-vitais-use-case';
import { DeleteSinaisVitaisUseCase } from './application/use-cases/delete-sinais-vitais-use-case';
import { FindAllSinaisVitaisUseCase } from './application/use-cases/find-all-sinais-vitais-use-case';
import { FindSinaisVitaisByIdUseCase } from './application/use-cases/find-sinais-vitais-by-id-use-case';
import { FindSinaisVitaisByPacienteIdUseCase } from './application/use-cases/find-sinais-vitais-by-paciente-id-use-case';
import { UpdateSinaisVitaisUseCase } from './application/use-cases/update-sinais-vitais-use-case';
import { SinaisVitaisRepository } from './domain/repositories/sinais-vitais.repository';
import { SinaisVitaisOrmEntity } from './infraestructure/orm/sinais-vitais-orm-entity';
import { SinaisVitaisRepositoryImpl } from './infraestructure/repositories/sinais-vitais.repository.impl';
import { SinaisVitaisController } from './presentation/sinais-vitais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SinaisVitaisOrmEntity])],
  controllers: [SinaisVitaisController],
  providers: [
    CreateSinaisVitaisUseCase,
    FindAllSinaisVitaisUseCase,
    FindSinaisVitaisByPacienteIdUseCase,
    FindSinaisVitaisByIdUseCase,
    UpdateSinaisVitaisUseCase,
    DeleteSinaisVitaisUseCase,
    {
      provide: SinaisVitaisRepository,
      useClass: SinaisVitaisRepositoryImpl,
    },
  ],
})
export class SinaisVitaisModule {}
