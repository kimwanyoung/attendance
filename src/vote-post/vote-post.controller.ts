import { Controller } from '@nestjs/common';
import { VotePostService } from './vote-post.service';

@Controller('vote-post')
export class VotePostController {
  constructor(private readonly votePostService: VotePostService) {}
}
