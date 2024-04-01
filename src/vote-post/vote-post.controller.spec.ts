import { Test, TestingModule } from '@nestjs/testing';
import { VotePostController } from './vote-post.controller';
import { VotePostService } from './vote-post.service';

describe('VotePostController', () => {
  let controller: VotePostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotePostController],
      providers: [VotePostService],
    }).compile();

    controller = module.get<VotePostController>(VotePostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
