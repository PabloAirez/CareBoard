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
import { CreatePacienteUseCase } from '../application/use-cases/create-paciente-use-case';
import { DeletePacienteUseCase } from '../application/use-cases/delete-paciente-use-case';
import { FindAllPacientesUseCase } from '../application/use-cases/find-all-paciente-use-case';
import { FindPacienteByIdUseCase } from '../application/use-cases/find-paciente-by-id-use-case';
import { UpdatePacienteUseCase } from '../application/use-cases/update-paciente-use-case';
import { Paciente } from '../domain/entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('api/patients')
export class PacienteController {
  constructor(
    private readonly createPaciente: CreatePacienteUseCase,
    private readonly findAllPacientes: FindAllPacientesUseCase,
    private readonly findPacienteById: FindPacienteByIdUseCase,
    private readonly updatePaciente: UpdatePacienteUseCase,
    private readonly deletePaciente: DeletePacienteUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreatePacienteDto) {
    const paciente = await this.createPaciente.execute(dto);

    return this.toResponse(paciente);
  }

  @Get()
  async findAll() {
    const pacientes = await this.findAllPacientes.execute();

    return pacientes.map((paciente) => this.toResponse(paciente));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const paciente = await this.findPacienteById.execute(id);

    return this.toResponse(paciente);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePacienteDto,
  ) {
    const paciente = await this.updatePaciente.execute(id, dto);

    return this.toResponse(paciente);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deletePaciente.execute(id);
  }

  private toResponse(paciente: Paciente) {
    return {
      id: paciente.id,
      name: paciente.nome,
      birthDate: paciente.dataNascimento,
      sex: paciente.sexo,
      hasContagiousDisease: paciente.temDoencaContagiosa,
    };
  }
}
