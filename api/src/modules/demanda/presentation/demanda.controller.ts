import { Body, Controller, Post } from '@nestjs/common';
import { PendingDemandService } from '../application/services/pending-demand.service';
import { CreatePatientDemandDto } from './dto/create-patient-demand.dto';
import { PendingDemandGateway } from './realtime/pending-demand.gateway';

@Controller('api/demands')
export class DemandaController {
  constructor(
    private readonly pendingDemandService: PendingDemandService,
    private readonly pendingDemandGateway: PendingDemandGateway,
  ) {}

  @Post()
  async create(@Body() dto: CreatePatientDemandDto) {
    const demand = await this.pendingDemandService.createPendingDemand(dto);

    await this.pendingDemandGateway.broadcastPendingDemands();

    return demand;
  }
}
