import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoteModel } from "./entities/vote.entity";
import { UserModel } from "../user/entity/user.entity";
import { PostModel } from "../post/entity/post.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VoteModel, UserModel, PostModel])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
