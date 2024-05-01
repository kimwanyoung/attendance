import { forwardRef, Module } from "@nestjs/common";
import { GroupService } from "./group.service";
import { GroupController } from "./group.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupModel } from "./entity/group.entity";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { PostModule } from "../post/post.module";
import { VoteModule } from "../vote/vote.module";
import { NoticeModule } from "../notice/notice.module";
import { MembershipModule } from "../membership/membership.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupModel]),
    AuthModule,
    UserModule,
    VoteModule,
    NoticeModule,
    MembershipModule,
    forwardRef(() => PostModule),
  ],
  exports: [GroupService],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
