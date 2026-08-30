import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PendingDemandService } from '../application/services/pending-demand.service';
import { CreatePatientDemandDto } from './dto/create-patient-demand.dto';
import { PendingDemandGateway } from './realtime/pending-demand.gateway';

@Controller('api/demands')
export class DemandaController {
  constructor(
    private readonly pendingDemandService: PendingDemandService,
    private readonly pendingDemandGateway: PendingDemandGateway,
  ) {}

  @Get('pending')
  async getPending(@Query('unitId') unitId?: string) {
    const parsedUnitId = unitId ? Number(unitId) : undefined;
    return this.pendingDemandService.findPending(parsedUnitId);
  }

  @Post()
  async create(@Body() dto: CreatePatientDemandDto) {
    const demand = await this.pendingDemandService.createPendingDemand(dto);

    await this.pendingDemandGateway.broadcastPendingDemands();

    return demand;
  }

  @Patch(':id/complete')
  async complete(@Param('id', ParseIntPipe) id: number) {
    const demand = await this.pendingDemandService.completeDemand(id);

    if (!demand) {
      throw new NotFoundException('Demanda nao encontrada.');
    }

    await this.pendingDemandGateway.broadcastPendingDemands();

    return demand;
  }
}
