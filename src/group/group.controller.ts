import {
  Body,
  Controller,
  Get,
  Param,
  Post, Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { AccessTokenGuard } from "../auth/guards/bearer-token.guard";

@Controller("group")
export class GroupController {
  constructor(private readonly groupService: GroupService) {
  }

  @Get(":groupId")
  async findGroup(@Param("groupId") groupId: number) {
    return await this.groupService.findGroupById(groupId);
  }

  @Get(":groupId/post/:postId")
  @UseGuards(AccessTokenGuard)
  async findPostDetail(
    @Request() request: any,
    @Param("groupId") groupId: number,
    @Param("postId") postId: number,
  ) {
    return await this.groupService.findPostDetail(groupId, postId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async createNewGroup(@Request() request: any, @Body() body: CreateGroupDto) {
    const user = request.user;
    return await this.groupService.createNewGroup(user, body);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async findGroupsByName(
    @Query("groupName") groupName: string,
    @Query("groupCreatorName") groupCreatorName: string,
  ) {
    return await this.groupService.findGroupByName(groupName, groupCreatorName);
  }
}
