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
import { CreateSinaisVitaisUseCase } from '../application/use-cases/create-sinais-vitais-use-case';
import { DeleteSinaisVitaisUseCase } from '../application/use-cases/delete-sinais-vitais-use-case';
import { FindAllSinaisVitaisUseCase } from '../application/use-cases/find-all-sinais-vitais-use-case';
import { FindSinaisVitaisByIdUseCase } from '../application/use-cases/find-sinais-vitais-by-id-use-case';
import { FindSinaisVitaisByPacienteIdUseCase } from '../application/use-cases/find-sinais-vitais-by-paciente-id-use-case';
import { UpdateSinaisVitaisUseCase } from '../application/use-cases/update-sinais-vitais-use-case';
import { SinaisVitais } from '../domain/entities/sinais-vitais.entity';
import { CreateSinaisVitaisDto } from './dto/create-sinais-vitais.dto';
import { UpdateSinaisVitaisDto } from './dto/update-sinais-vitais.dto';

@Controller('api/vital-signs')
export class SinaisVitaisController {
  constructor(
    private readonly createSinaisVitais: CreateSinaisVitaisUseCase,
    private readonly findAllSinaisVitais: FindAllSinaisVitaisUseCase,
    private readonly findSinaisVitaisByPacienteId: FindSinaisVitaisByPacienteIdUseCase,
    private readonly findSinaisVitaisById: FindSinaisVitaisByIdUseCase,
    private readonly updateSinaisVitais: UpdateSinaisVitaisUseCase,
    private readonly deleteSinaisVitais: DeleteSinaisVitaisUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateSinaisVitaisDto) {
    const sinaisVitais = await this.createSinaisVitais.execute(dto);

    return this.toResponse(sinaisVitais);
  }

  @Get()
  async findAll() {
    const sinaisVitais = await this.findAllSinaisVitais.execute();

    return sinaisVitais.map((item) => this.toResponse(item));
  }

  @Get('patient/:patientId')
  async findByPatientId(
    @Param('patientId', ParseIntPipe)
    patientId: number,
  ) {
    const sinaisVitais =
      await this.findSinaisVitaisByPacienteId.execute(patientId);

    return sinaisVitais.map((item) => this.toResponse(item));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sinaisVitais = await this.findSinaisVitaisById.execute(id);

    return this.toResponse(sinaisVitais);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSinaisVitaisDto,
  ) {
    const sinaisVitais = await this.updateSinaisVitais.execute(id, dto);

    return this.toResponse(sinaisVitais);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteSinaisVitais.execute(id);
  }

  private toResponse(sinaisVitais: SinaisVitais) {
    return {
      id: sinaisVitais.id,
      patientId: sinaisVitais.pacienteId,
      dateTime: sinaisVitais.dataHora,
      oximetry: sinaisVitais.oximetria,
      usesOxygenSupport: sinaisVitais.usaSuporteOxigenio,
      temperature: sinaisVitais.temperatura,
      heartRate: sinaisVitais.frequenciaCardiaca,
      respiratoryRate: sinaisVitais.frequenciaRespiratoria,
      systolicPressure: sinaisVitais.pressaoSistolica,
      diastolicPressure: sinaisVitais.pressaoDiastolica,
      consciousnessLevel: sinaisVitais.nivelConsciencia,
      mewsScore: sinaisVitais.mewsScore,
    };
  }
}
