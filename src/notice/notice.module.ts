import { Module } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { NoticeController } from "./notice.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoticeModel } from "./entity/notice.entity";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([NoticeModel]), AuthModule, UserModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
