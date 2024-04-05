import {
  Body,
  Controller,
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

  @Post()
  @UseGuards(AccessTokenGuard)
  async createNewGroup(@Request() request: any, @Body() body: CreateGroupDto) {
    const user = request.user;
    return await this.groupService.createNewGroup(user, body);
  }
}
