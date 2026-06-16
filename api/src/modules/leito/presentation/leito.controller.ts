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
import { CreateLeitoUseCase } from '../application/use-cases/create-leito-use-case';
import { DeleteLeitoUseCase } from '../application/use-cases/delete-leito-use-case';
import { FindAllLeitosUseCase } from '../application/use-cases/find-all-leito-use-case';
import { FindLeitoByIdUseCase } from '../application/use-cases/find-leito-by-id-use-case';
import { FindLeitosByUnidadeIdUseCase } from '../application/use-cases/find-leitos-by-unidade-id-use-case';
import { UpdateLeitoUseCase } from '../application/use-cases/update-leito-use-case';
import { Leito } from '../domain/entities/leito.entity';
import { CreateLeitoDto } from './dto/create-leito.dto';
import { UpdateLeitoDto } from './dto/update-leito.dto';

@Controller('api/beds')
export class LeitoController {
  constructor(
    private readonly createLeito: CreateLeitoUseCase,
    private readonly findAllLeitos: FindAllLeitosUseCase,
    private readonly findLeitosByUnidadeId: FindLeitosByUnidadeIdUseCase,
    private readonly findLeitoById: FindLeitoByIdUseCase,
    private readonly updateLeito: UpdateLeitoUseCase,
    private readonly deleteLeito: DeleteLeitoUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateLeitoDto) {
    const leito = await this.createLeito.execute(dto);

    return this.toResponse(leito);
  }

  @Get()
  async findAll() {
    const leitos = await this.findAllLeitos.execute();

    return leitos.map((leito) => this.toResponse(leito));
  }

  @Get('unit/:unitId')
  async findByUnitId(
    @Param('unitId', ParseIntPipe)
    unitId: number,
  ) {
    const leitos = await this.findLeitosByUnidadeId.execute(unitId);

    return leitos.map((leito) => this.toResponse(leito));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const leito = await this.findLeitoById.execute(id);

    return this.toResponse(leito);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLeitoDto,
  ) {
    const leito = await this.updateLeito.execute(id, dto);

    return this.toResponse(leito);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteLeito.execute(id);
  }

  private toResponse(leito: Leito) {
    return {
      id: leito.id,
      number: leito.numero,
      unitId: leito.unidadeId,
      bedStatusId: leito.statusLeitoId,
    };
  }
}
