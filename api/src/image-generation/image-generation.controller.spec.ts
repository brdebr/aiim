import { Test, TestingModule } from '@nestjs/testing';
import { ImageGenerationController } from './image-generation.controller';

describe('ImageGenerationController', () => {
  let controller: ImageGenerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageGenerationController],
    }).compile();

    controller = module.get<ImageGenerationController>(ImageGenerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
