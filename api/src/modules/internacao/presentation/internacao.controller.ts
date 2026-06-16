import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateInternacaoUseCase } from '../application/use-cases/create-internacao-use-case';
import { DeleteInternacaoUseCase } from '../application/use-cases/delete-internacao-use-case';
import { FindAllInternacoesUseCase } from '../application/use-cases/find-all-internacao-use-case';
import { FindInternacaoByIdUseCase } from '../application/use-cases/find-internacao-by-id-use-case';
import { FindInternacoesByLeitoIdUseCase } from '../application/use-cases/find-internacoes-by-leito-id-use-case';
import { FindInternacoesByPacienteIdUseCase } from '../application/use-cases/find-internacoes-by-paciente-id-use-case';
import { UpdateInternacaoUseCase } from '../application/use-cases/update-internacao-use-case';
import { Internacao } from '../domain/entities/internacao.entity';
import { CreateInternacaoDto } from './dto/create-internacao.dto';
import { UpdateInternacaoDto } from './dto/update-internacao.dto';

@Controller('api/admissions')
export class InternacaoController {
  constructor(
    private readonly createInternacao: CreateInternacaoUseCase,
    private readonly findAllInternacoes: FindAllInternacoesUseCase,
    private readonly findInternacoesByPacienteId: FindInternacoesByPacienteIdUseCase,
    private readonly findInternacoesByLeitoId: FindInternacoesByLeitoIdUseCase,
    private readonly findInternacaoById: FindInternacaoByIdUseCase,
    private readonly updateInternacao: UpdateInternacaoUseCase,
    private readonly deleteInternacao: DeleteInternacaoUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateInternacaoDto) {
    const internacao = await this.createInternacao.execute(dto);

    return this.toResponse(internacao);
  }

  @Get()
  async findAll() {
    const internacoes = await this.findAllInternacoes.execute();

    return internacoes.map((internacao) => this.toResponse(internacao));
  }

  @Get('patient/:patientId')
  async findByPatientId(
    @Param('patientId', ParseIntPipe)
    patientId: number,
  ) {
    const internacoes =
      await this.findInternacoesByPacienteId.execute(patientId);

    return internacoes.map((internacao) => this.toResponse(internacao));
  }

  @Get('bed/:bedId')
  async findByBedId(
    @Param('bedId', ParseIntPipe)
    bedId: number,
  ) {
    const internacoes = await this.findInternacoesByLeitoId.execute(bedId);

    return internacoes.map((internacao) => this.toResponse(internacao));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const internacao = await this.findInternacaoById.execute(id);

    return this.toResponse(internacao);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInternacaoDto,
  ) {
    const internacao = await this.updateInternacao.execute(id, dto);

    return this.toResponse(internacao);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteInternacao.execute(id);
  }

  private toResponse(internacao: Internacao) {
    return {
      id: internacao.id,
      patientId: internacao.pacienteId,
      bedId: internacao.leitoId,
      admissionDate: internacao.dataEntrada,
      dischargeDate: internacao.dataSaida,
      admissionStatusId: internacao.statusInternacaoId,
    };
  }
}
