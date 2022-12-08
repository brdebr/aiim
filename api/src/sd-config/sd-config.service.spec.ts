import { Test, TestingModule } from '@nestjs/testing';
import { SdConfigService } from './sd-config.service';

describe('SdConfigService', () => {
  let service: SdConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SdConfigService],
    }).compile();

    service = module.get<SdConfigService>(SdConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
