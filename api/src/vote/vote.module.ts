import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';

@Module({
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
