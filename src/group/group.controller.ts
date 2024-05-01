import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { AccessTokenGuard } from "../auth/guards/bearer-token.guard";
import { PostService } from "../post/post.service";
import { AuthorizationManagementGuard } from "../core/guards/authorization-management.guard";
import { CreatePostDto } from "../post/dto/create-post.dto";
import { VoteStatus } from "../vote/const/vote.const";
import { VoteService } from "../vote/vote.service";

@Controller("group")
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly postService: PostService,
    private readonly voteService: VoteService,
  ) {}

  @Get(":groupId")
  async findGroup(@Param("groupId") groupId: number) {
    return await this.groupService.findGroupById(groupId);
  }

  @Get(":groupId/post/:postId")
  @UseGuards(AccessTokenGuard)
  async findPostDetail(
    @Param("groupId") groupId: number,
    @Param("postId") postId: number,
  ) {
    return await this.postService.findPostById(groupId, postId);
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

  @Get(":groupId/post")
  @UseGuards(AccessTokenGuard)
  async findAllPostsByGroupId(@Param("groupId") groupId: number) {
    return this.postService.findAllPosts(groupId);
  }

  @Post(":groupId/post")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async createPost(
    @Request() request: any,
    @Param("groupId") groupId: number,
    @Body() postData: CreatePostDto,
  ) {
    const user = request.user;
    return await this.postService.createPost(user, groupId, postData);
  }

  @Post(":groupId/post/:postId/vote")
  @UseGuards(AccessTokenGuard)
  async updateVote(
    @Request() request: any,
    @Param("groupId") groupId: number,
    @Param("postId") postId: number,
    @Body("voteStatus") voteStatus: VoteStatus,
  ) {
    const userId = request.user.id;
    return await this.voteService.voteOnPost({
      userId,
      groupId,
      postId,
      voteStatus,
    });
  }

  @Get(":groupId/post/:postId/vote")
  @UseGuards(AccessTokenGuard)
  async getVotesByPostId(
    @Request() request: any,
    @Param("postId") postId: number,
  ) {
    const user = request.user;
    return await this.voteService.findVotesByPostId(user.id, postId);
  }
}
