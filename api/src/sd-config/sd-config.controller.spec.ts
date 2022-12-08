import { Test, TestingModule } from '@nestjs/testing';
import { SdConfigController } from './sd-config.controller';

describe('SdConfigController', () => {
  let controller: SdConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SdConfigController],
    }).compile();

    controller = module.get<SdConfigController>(SdConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
