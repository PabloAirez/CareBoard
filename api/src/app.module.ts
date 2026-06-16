import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntitiesModule } from './modules/database/database-entities.module';
import { HospitalModule } from './modules/hospital/hospital.module';
import { InternacaoModule } from './modules/internacao/internacao.module';
import { LeitoModule } from './modules/leito/leito.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { SinaisVitaisModule } from './modules/sinais-vitais/sinais-vitais.module';
import { StatusLeitoModule } from './modules/status-leito/status-leito.module';
import { UnidadeModule } from './modules/unidade/unidade.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    DatabaseEntitiesModule,
    HospitalModule,
    UnidadeModule,
    LeitoModule,
    PacienteModule,
    InternacaoModule,
    StatusLeitoModule,
    SinaisVitaisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
