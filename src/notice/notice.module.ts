import { Module } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { NoticeController } from "./notice.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoticeModel } from "./entity/notice.entity";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { GroupModule } from "../group/group.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticeModel]),
    AuthModule,
    UserModule,
    GroupModule,
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
