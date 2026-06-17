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
import { CreateStatusLeitoUseCase } from '../application/use-cases/create-status-leito-use-case';
import { DeleteStatusLeitoUseCase } from '../application/use-cases/delete-status-leito-use-case';
import { FindAllStatusLeitoUseCase } from '../application/use-cases/find-all-status-leito-use-case';
import { FindStatusLeitoByIdUseCase } from '../application/use-cases/find-status-leito-by-id-use-case';
import { UpdateStatusLeitoUseCase } from '../application/use-cases/update-status-leito-use-case';
import { StatusLeito } from '../domain/entities/status-leito.entity';
import { CreateStatusLeitoDto } from './dto/create-status-leito.dto';
import { UpdateStatusLeitoDto } from './dto/update-status-leito.dto';

@Controller('api/bed-statuses')
export class StatusLeitoController {
  constructor(
    private readonly createStatusLeito: CreateStatusLeitoUseCase,
    private readonly findAllStatusLeito: FindAllStatusLeitoUseCase,
    private readonly findStatusLeitoById: FindStatusLeitoByIdUseCase,
    private readonly updateStatusLeito: UpdateStatusLeitoUseCase,
    private readonly deleteStatusLeito: DeleteStatusLeitoUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateStatusLeitoDto) {
    const statusLeito = await this.createStatusLeito.execute(dto);

    return this.toResponse(statusLeito);
  }

  @Get()
  async findAll() {
    const statuses = await this.findAllStatusLeito.execute();

    return statuses.map((statusLeito) => this.toResponse(statusLeito));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const statusLeito = await this.findStatusLeitoById.execute(id);

    return this.toResponse(statusLeito);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusLeitoDto,
  ) {
    const statusLeito = await this.updateStatusLeito.execute(id, dto);

    return this.toResponse(statusLeito);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteStatusLeito.execute(id);
  }

  private toResponse(statusLeito: StatusLeito) {
    return {
      id: statusLeito.id,
      description: statusLeito.descricao,
    };
  }
}
