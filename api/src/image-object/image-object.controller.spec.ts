import { Test, TestingModule } from '@nestjs/testing';
import { ImageObjectController } from './image-object.controller';

describe('ImageObjectController', () => {
  let controller: ImageObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageObjectController],
    }).compile();

    controller = module.get<ImageObjectController>(ImageObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
