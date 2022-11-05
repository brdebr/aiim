import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from './vote.controller';

describe('VoteController', () => {
  let controller: VoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
    }).compile();

    controller = module.get<VoteController>(VoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
