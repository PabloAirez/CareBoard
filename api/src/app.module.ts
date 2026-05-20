import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './pacientes/pacientes.module';

@Module({
  imports: [PacientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
