import { Module } from '@nestjs/common';
import { ImageObjectService } from './image-object.service';
import { ImageObjectController } from './image-object.controller';

@Module({
  providers: [ImageObjectService],
  controllers: [ImageObjectController],
})
export class ImageObjectModule {}
