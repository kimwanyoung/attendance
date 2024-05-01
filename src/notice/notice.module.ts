import { Module } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { NoticeController } from "./notice.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoticeModel } from "./entity/notice.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NoticeModel])],
  exports: [NoticeService],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
