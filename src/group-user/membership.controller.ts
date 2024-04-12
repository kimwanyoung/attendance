import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';
import { ApprovalDto } from './dto/approval.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly groupUserService: MembershipService) {}

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

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAllGroupsByUserId(@Request() request: any) {
    const userId = request.user.id;
    return await this.groupUserService.findAllGroupsByUserId(userId);
  }
}