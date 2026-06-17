import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('beds')
  findBeds(
    @Query('unitId', new ParseIntPipe({ optional: true }))
    unitId?: number,
  ) {
    return this.dashboardService.findBeds(unitId);
  }
}
