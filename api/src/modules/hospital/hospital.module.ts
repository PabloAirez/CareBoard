import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateHospitalUseCase } from './application/use-cases/create-hospital-use-case';
import { DeleteHospitalUseCase } from './application/use-cases/delete-hospital-use-case';
import { FindAllHospitalsUseCase } from './application/use-cases/find-all-hospital-use-case';
import { FindHospitalByIdUseCase } from './application/use-cases/find-hospital-by-id-use-case';
import { UpdateHospitalUseCase } from './application/use-cases/update-hospital-use-case';
import { HospitalRepository } from './domain/repositories/hospital.repository';
import { HospitalOrmEntity } from './infraestructure/orm/hospital-orm-entity';
import { HospitalRepositoryImpl } from './infraestructure/repositories/hospital.repository.impl';
import { HospitalController } from './presentation/hospital.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalOrmEntity])],
  controllers: [HospitalController],
  providers: [
    CreateHospitalUseCase,
    FindAllHospitalsUseCase,
    FindHospitalByIdUseCase,
    UpdateHospitalUseCase,
    DeleteHospitalUseCase,

    {
      provide: HospitalRepository,
      useClass: HospitalRepositoryImpl,
    },
  ],
})
export class HospitalModule {}
