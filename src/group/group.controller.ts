import { Body, Controller, Get, Headers, Logger, Post } from "@nestjs/common";
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async testCreate() {
    return await this.groupService.createGroup();
  }

  @Post()
  async createGroup(
    @Headers('authorization') rawToken: string,
    @Body() groupData: CreateGroupDto,
  ) {
    Logger.log(groupData.title);
    return await this.groupService.createGroupByAccessToken(
      rawToken,
      groupData,
    );
  }
}
