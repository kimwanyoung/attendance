import { Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { GroupUserService } from './group-user.service';
import { AccessTokenGuard } from "../auth/guards/bearer-token.guard";

@Controller('group-user')
export class GroupUserController {
  constructor(private readonly groupUserService: GroupUserService) {}

  @Post('apply/:groupId')
  @UseGuards(AccessTokenGuard)
  async applyUser(@Request() request: any, @Param('groupId') groupId: number) {
    const user = request.user;
    return await this.groupUserService.applyToJoinGroup(user, groupId);
  }
}
