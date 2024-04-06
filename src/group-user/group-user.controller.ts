import { Body, Controller, Get, Logger, Param, Post, Request, UseGuards } from "@nestjs/common";
import { GroupUserService } from './group-user.service';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';
import { ApprovalDto } from "./dto/approval.dto";

@Controller('group-user')
export class GroupUserController {
  constructor(private readonly groupUserService: GroupUserService) {}

  @Get(':groupId')
  async findAllWaitUsers(@Param('groupId') groupId: number) {
    return await this.groupUserService.findWaitListByGroupId(groupId);
  }

  @Post('approval')
  @UseGuards(AccessTokenGuard)
  async approvalUser(
    @Request() request: any,
    @Body() approvalData: ApprovalDto,
  ) {
    const creator = request.user;
    return await this.groupUserService.approvalJoinGroup(
      creator.id,
      approvalData,
    );
  }

  @Post('apply/:groupId')
  @UseGuards(AccessTokenGuard)
  async applyUser(@Request() request: any, @Param('groupId') groupId: number) {
    const user = request.user;
    return await this.groupUserService.applyToJoinGroup(user, groupId);
  }
}
