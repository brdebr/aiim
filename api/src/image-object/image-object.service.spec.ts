import { Test, TestingModule } from '@nestjs/testing';
import { ImageObjectService } from './image-object.service';

describe('ImageObjectService', () => {
  let service: ImageObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageObjectService],
    }).compile();

    service = module.get<ImageObjectService>(ImageObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
