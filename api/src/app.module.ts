import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DatabaseEntitiesModule } from './modules/database/database-entities.module';
import { DemandaModule } from './modules/demanda/demanda.module';
import { HospitalModule } from './modules/hospital/hospital.module';
import { InternacaoModule } from './modules/internacao/internacao.module';
import { LeitoModule } from './modules/leito/leito.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { SeedModule } from './modules/seed/seed.module';
import { SinaisVitaisModule } from './modules/sinais-vitais/sinais-vitais.module';
import { StatusLeitoModule } from './modules/status-leito/status-leito.module';
import { UnidadeModule } from './modules/unidade/unidade.module';
import { SighModule } from './modules/sigh/sigh.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    SeedModule,
    AuthModule,
    DashboardModule,
    DemandaModule,
    HospitalModule,
    UnidadeModule,
    LeitoModule,
    PacienteModule,
    InternacaoModule,
    StatusLeitoModule,
    SinaisVitaisModule,
    SighModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
