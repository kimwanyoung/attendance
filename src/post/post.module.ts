import { forwardRef, Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { UserModel } from "../user/entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostModel } from "./entity/post.entity";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { GroupModule } from "../group/group.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel, UserModel]),
    AuthModule,
    UserModule,
    forwardRef(() => GroupModule),
  ],
  exports: [PostService],
  providers: [PostService],
})
export class PostModule {}
