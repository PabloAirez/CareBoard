import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { HigienizacaoService } from '../application/services/higienizacao.service';
import { SighGateway } from '../../sigh/presentation/sigh.gateway';

@Controller('api/higienizacao')
export class HigienizacaoController {
  constructor(
    private readonly higienizacaoService: HigienizacaoService,
    private readonly sighGateway: SighGateway,
  ) {}

  @Get('leitos')
  async getBedsForCleaning(@Query('unitId') unitId?: string) {
    const parsedUnitId = unitId ? Number(unitId) : undefined;
    return this.higienizacaoService.findAllBedsForCleaning(parsedUnitId);
  }

  @Patch('leitos/:id/iniciar')
  async startCleaning(
    @Param('id', ParseIntPipe) id: number,
    @Body('usuarioId') usuarioId?: number,
  ) {
    const result = await this.higienizacaoService.startCleaning(id, usuarioId);
    if (this.sighGateway?.server) {
      this.sighGateway.server.emit('leitos:atualizado', { timestamp: new Date() });
    }
    return result;
  }

  @Patch('leitos/:id/concluir')
  async finishCleaning(
    @Param('id', ParseIntPipe) id: number,
    @Body('usuarioId') usuarioId?: number,
  ) {
    const result = await this.higienizacaoService.finishCleaning(id, usuarioId);
    if (this.sighGateway?.server) {
      this.sighGateway.server.emit('leitos:atualizado', { timestamp: new Date() });
    }
    return result;
  }

  @Post('leitos/:id/alta')
  async registerDischarge(@Param('id', ParseIntPipe) id: number) {
    const result = await this.higienizacaoService.registerDischarge(id);
    if (this.sighGateway?.server) {
      this.sighGateway.server.emit('leitos:atualizado', { timestamp: new Date() });
    }
    return result;
  }
}
