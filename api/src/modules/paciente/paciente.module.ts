import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePacienteUseCase } from './application/use-cases/create-paciente-use-case';
import { DeletePacienteUseCase } from './application/use-cases/delete-paciente-use-case';
import { FindAllPacientesUseCase } from './application/use-cases/find-all-paciente-use-case';
import { FindPacienteByIdUseCase } from './application/use-cases/find-paciente-by-id-use-case';
import { UpdatePacienteUseCase } from './application/use-cases/update-paciente-use-case';
import { PacienteRepository } from './domain/repositories/paciente.repository';
import { PacienteOrmEntity } from './infraestructure/orm/paciente-orm-entity';
import { PacienteRepositoryImpl } from './infraestructure/repositories/paciente.repository.impl';
import { PacienteController } from './presentation/paciente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteOrmEntity])],
  controllers: [PacienteController],
  providers: [
    CreatePacienteUseCase,
    FindAllPacientesUseCase,
    FindPacienteByIdUseCase,
    UpdatePacienteUseCase,
    DeletePacienteUseCase,
    {
      provide: PacienteRepository,
      useClass: PacienteRepositoryImpl,
    },
  ],
})
export class PacienteModule {}
