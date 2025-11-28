import { Test, TestingModule } from '@nestjs/testing';
import { ReferenteController } from './referente.controller';
import { ReferenteService } from './referente.service';

describe('ReferenteController', () => {
  let controller: ReferenteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenteController],
      providers: [ReferenteService],
    }).compile();

    controller = module.get<ReferenteController>(ReferenteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
