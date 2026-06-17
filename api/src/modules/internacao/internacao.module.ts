import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateInternacaoUseCase } from './application/use-cases/create-internacao-use-case';
import { DeleteInternacaoUseCase } from './application/use-cases/delete-internacao-use-case';
import { FindAllInternacoesUseCase } from './application/use-cases/find-all-internacao-use-case';
import { FindInternacaoByIdUseCase } from './application/use-cases/find-internacao-by-id-use-case';
import { FindInternacoesByLeitoIdUseCase } from './application/use-cases/find-internacoes-by-leito-id-use-case';
import { FindInternacoesByPacienteIdUseCase } from './application/use-cases/find-internacoes-by-paciente-id-use-case';
import { UpdateInternacaoUseCase } from './application/use-cases/update-internacao-use-case';
import { InternacaoRepository } from './domain/repositories/internacao.repository';
import { InternacaoOrmEntity } from './infraestructure/orm/internacao-orm-entity';
import { InternacaoRepositoryImpl } from './infraestructure/repositories/internacao.repository.impl';
import { InternacaoController } from './presentation/internacao.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InternacaoOrmEntity])],
  controllers: [InternacaoController],
  providers: [
    CreateInternacaoUseCase,
    FindAllInternacoesUseCase,
    FindInternacoesByPacienteIdUseCase,
    FindInternacoesByLeitoIdUseCase,
    FindInternacaoByIdUseCase,
    UpdateInternacaoUseCase,
    DeleteInternacaoUseCase,
    {
      provide: InternacaoRepository,
      useClass: InternacaoRepositoryImpl,
    },
  ],
})
export class InternacaoModule {}
