import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusLeitoSeeder } from './application/seeders/status-leito.seeder';
import { CreateStatusLeitoUseCase } from './application/use-cases/create-status-leito-use-case';
import { DeleteStatusLeitoUseCase } from './application/use-cases/delete-status-leito-use-case';
import { FindAllStatusLeitoUseCase } from './application/use-cases/find-all-status-leito-use-case';
import { FindStatusLeitoByIdUseCase } from './application/use-cases/find-status-leito-by-id-use-case';
import { UpdateStatusLeitoUseCase } from './application/use-cases/update-status-leito-use-case';
import { StatusLeitoRepository } from './domain/repositories/status-leito.repository';
import { StatusLeitoOrmEntity } from './infraestructure/orm/status-leito-orm-entity';
import { StatusLeitoRepositoryImpl } from './infraestructure/repositories/status-leito.repository.impl';
import { StatusLeitoController } from './presentation/status-leito.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatusLeitoOrmEntity])],
  controllers: [StatusLeitoController],
  providers: [
    CreateStatusLeitoUseCase,
    FindAllStatusLeitoUseCase,
    FindStatusLeitoByIdUseCase,
    UpdateStatusLeitoUseCase,
    DeleteStatusLeitoUseCase,
    StatusLeitoSeeder,
    {
      provide: StatusLeitoRepository,
      useClass: StatusLeitoRepositoryImpl,
    },
  ],
})
export class StatusLeitoModule {}
