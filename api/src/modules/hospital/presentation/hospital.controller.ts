import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateHospitalUseCase } from '../application/use-cases/create-hospital-use-case';
import { DeleteHospitalUseCase } from '../application/use-cases/delete-hospital-use-case';
import { FindAllHospitalsUseCase } from '../application/use-cases/find-all-hospital-use-case';
import { FindHospitalByIdUseCase } from '../application/use-cases/find-hospital-by-id-use-case';
import { UpdateHospitalUseCase } from '../application/use-cases/update-hospital-use-case';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

@Controller('hospitals')
export class HospitalController {
  constructor(
    private readonly createHospital: CreateHospitalUseCase,

    private readonly findAllHospitals: FindAllHospitalsUseCase,

    private readonly findHospitalById: FindHospitalByIdUseCase,

    private readonly updateHospital: UpdateHospitalUseCase,

    private readonly deleteHospital: DeleteHospitalUseCase,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateHospitalDto,
  ) {
    return this.createHospital.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllHospitals.execute();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: number,
  ) {
    return this.findHospitalById.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id')
    id: number,
    @Body()
    dto: UpdateHospitalDto,
  ) {
    return this.updateHospital.execute(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id')
    id: number,
  ) {
    return this.deleteHospital.execute(id);
  }
}
