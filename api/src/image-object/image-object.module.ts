import { VoteModule } from './../vote/vote.module';
import { Module } from '@nestjs/common';
import { ImageObjectService } from './image-object.service';
import { ImageObjectController } from './image-object.controller';

@Module({
  imports: [VoteModule],
  providers: [ImageObjectService],
  controllers: [ImageObjectController],
})
export class ImageObjectModule {}
