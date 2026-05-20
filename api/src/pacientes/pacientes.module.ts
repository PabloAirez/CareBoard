import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

@Module({
  controllers: [PacientesController],
  providers: [PacientesService],
})
export class PacientesModule {}
