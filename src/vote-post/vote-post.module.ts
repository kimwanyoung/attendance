import { Module } from '@nestjs/common';
import { VotePostService } from './vote-post.service';
import { VotePostController } from './vote-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotePostModel } from './entity/vote-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VotePostModel])],
  controllers: [VotePostController],
  providers: [VotePostService],
})
export class VotePostModule {}
