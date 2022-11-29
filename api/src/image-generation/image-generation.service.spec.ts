import { Test, TestingModule } from '@nestjs/testing';
import { ImageGenerationService } from './image-generation.service';

describe('ImageGenerationService', () => {
  let service: ImageGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageGenerationService],
    }).compile();

    service = module.get<ImageGenerationService>(ImageGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
