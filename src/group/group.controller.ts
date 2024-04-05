import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get(':groupId')
  async findGroup(@Param('groupId') groupId: number) {
    return await this.groupService.findGroupById(groupId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async createNewGroup(@Request() request: any, @Body() body: CreateGroupDto) {
    const user = request.user;
    return await this.groupService.createNewGroup(user, body);
  }
}
