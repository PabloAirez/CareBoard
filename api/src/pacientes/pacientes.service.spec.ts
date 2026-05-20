import { Test, TestingModule } from '@nestjs/testing';
import { PacientesService } from './pacientes.service';

describe('PacientesService', () => {
  let service: PacientesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PacientesService],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
