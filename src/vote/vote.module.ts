import { forwardRef, Module } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { VoteController } from "./vote.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoteModel } from "./entities/vote.entity";
import { UserModel } from "../user/entity/user.entity";
import { PostModel } from "../post/entity/post.entity";
import { GroupModule } from "../group/group.module";
import { PostModule } from "../post/post.module";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteModel, UserModel, PostModel]),
    forwardRef(() => GroupModule),
    UserModule,
    AuthModule,
    forwardRef(() => PostModule),
  ],
  exports: [VoteService],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
