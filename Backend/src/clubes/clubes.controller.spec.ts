import { Test, TestingModule } from '@nestjs/testing';
import { ClubesController } from './clubes.controller';
import { ClubesService } from './clubes.service';

describe('ClubesController', () => {
  let controller: ClubesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubesController],
      providers: [ClubesService],
    }).compile();

    controller = module.get<ClubesController>(ClubesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
