import { Module } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoticeModel } from "./entity/notice.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NoticeModel])],
  exports: [NoticeService],
  providers: [NoticeService],
})
export class NoticeModule {}
