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
import { CreateUnidadeUseCase } from '../application/use-cases/create-unidade-use-case';
import { DeleteUnidadeUseCase } from '../application/use-cases/delete-unidade-use-case';
import { FindAllUnidadesUseCase } from '../application/use-cases/find-all-unidade-use-case';
import { FindUnidadeByIdUseCase } from '../application/use-cases/find-unidade-by-id-use-case';
import { FindUnidadesByHospitalIdUseCase } from '../application/use-cases/find-unidades-by-hospital-id-use-case';
import { UpdateUnidadeUseCase } from '../application/use-cases/update-unidade-use-case';
import { Unidade } from '../domain/entities/unidade.entity';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';

@Controller('api/units')
export class UnidadeController {
  constructor(
    private readonly createUnidade: CreateUnidadeUseCase,
    private readonly findAllUnidades: FindAllUnidadesUseCase,
    private readonly findUnidadesByHospitalId: FindUnidadesByHospitalIdUseCase,
    private readonly findUnidadeById: FindUnidadeByIdUseCase,
    private readonly updateUnidade: UpdateUnidadeUseCase,
    private readonly deleteUnidade: DeleteUnidadeUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUnidadeDto) {
    const unidade = await this.createUnidade.execute(dto);

    return this.toResponse(unidade);
  }

  @Get()
  async findAll() {
    const unidades = await this.findAllUnidades.execute();

    return unidades.map((unidade) => this.toResponse(unidade));
  }

  @Get('hospital/:hospitalId')
  async findByHospitalId(
    @Param('hospitalId', ParseIntPipe)
    hospitalId: number,
  ) {
    const unidades = await this.findUnidadesByHospitalId.execute(hospitalId);

    return unidades.map((unidade) => this.toResponse(unidade));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const unidade = await this.findUnidadeById.execute(id);

    return this.toResponse(unidade);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnidadeDto,
  ) {
    const unidade = await this.updateUnidade.execute(id, dto);

    return this.toResponse(unidade);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUnidade.execute(id);
  }

  private toResponse(unidade: Unidade) {
    return {
      id: unidade.id,
      name: unidade.nome,
      hospitalId: unidade.hospitalId,
      idSistemaExterno: unidade.idSistemaExterno ?? null,
      externalSystemId: unidade.idSistemaExterno ?? null,
    };
  }
}
