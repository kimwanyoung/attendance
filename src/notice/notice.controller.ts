import {
  Body,
  Controller, Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { AccessTokenGuard} from "../auth/guards/bearer-token.guard";
import { NoticeDto } from "./dto/notice.dto";
import { AuthorizationManagementGuard } from "../core/guards/authorization-management.guard";

@Controller("notice")
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post(":groupId")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async createNotice(
    @Request() request: any,
    @Body() data: NoticeDto,
    @Param("groupId") groupId: number,
  ) {
    const userId = request.user.id;
    return await this.noticeService.createNotice(userId, groupId, data);
  }
}
