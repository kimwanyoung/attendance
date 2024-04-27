import { Body, Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { AccessTokenGuard } from "../auth/guards/bearer-token.guard";
import { NoticeDto } from "./dto/notice.dto";

@Controller("notice")
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post(":groupId")
  @UseGuards(AccessTokenGuard)
  async createNotice(
    @Request() request: any,
    @Body() data: NoticeDto,
    @Param("groupId") groupId: number,
  ) {
    const userId = request.user.id;
    return await this.noticeService.createNotice(userId, groupId, data);
  }
}
