import { Controller, Post } from '@nestjs/common';

@Controller('vote')
export class VoteController {
  @Post()
  async vote() {
    return 'vote';
  }
}
