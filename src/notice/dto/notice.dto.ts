import { PickType } from "@nestjs/mapped-types";
import { NoticeModel } from "../entity/notice.entity";

export class NoticeDto extends PickType(NoticeModel, ["title", "contents"]) {}
