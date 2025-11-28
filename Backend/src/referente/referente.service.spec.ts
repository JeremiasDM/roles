import { Test, TestingModule } from '@nestjs/testing';
import { ReferenteService } from './referente.service';

describe('ReferenteService', () => {
  let service: ReferenteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenteService],
    }).compile();

    service = module.get<ReferenteService>(ReferenteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
