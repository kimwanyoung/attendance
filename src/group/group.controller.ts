import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { NoticeDto } from "../notice/dto/notice.dto";
import { NoticeService } from "../notice/notice.service";
import { MembershipService } from "../membership/membership.service";
import { Status } from "../membership/const/status.const";

@Controller("group")
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly postService: PostService,
    private readonly voteService: VoteService,
    private readonly noticeService: NoticeService,
    private readonly membershipService: MembershipService,
  ) {}

  /*
   그룹 조회, 생성
   */
  @Get(":groupId")
  async findGroup(@Param("groupId") groupId: number) {
    return await this.groupService.findGroupById(groupId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async findGroupsByName(
    @Query("groupName") groupName: string,
    @Query("groupCreatorName") groupCreatorName: string,
  ) {
    return await this.groupService.findGroupByName(groupName, groupCreatorName);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async createNewGroup(@Request() request: any, @Body() body: CreateGroupDto) {
    const user = request.user;
    return await this.groupService.createNewGroup(user, body);
  }

  @Delete(":groupId")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async deleteGroup(@Param("groupId") groupId: number) {
    return await this.groupService.delete(groupId);
  }

  /*
  일정 조회, 생성
   */
  @Get(":groupId/post/:postId")
  @UseGuards(AccessTokenGuard)
  async findPostDetail(
    @Param("groupId") groupId: number,
    @Param("postId") postId: number,
  ) {
    return await this.postService.findPostById(groupId, postId);
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

  /*
  투표 조회, 생성
   */
  @Get(":groupId/post/:postId/vote")
  @UseGuards(AccessTokenGuard)
  async getVotesByPostId(
    @Request() request: any,
    @Param("postId") postId: number,
  ) {
    const user = request.user;
    return await this.voteService.findVotesByPostId(user.id, postId);
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

  /*
  공지 조회, 생성
   */
  @Get(":groupId/notice")
  @UseGuards(AccessTokenGuard)
  async findNotices(@Param("groupId") groupId: number) {
    return await this.noticeService.findAllNotice(groupId);
  }

  @Get(":groupId/notice/:noticeId")
  @UseGuards(AccessTokenGuard)
  async findOneNotice(
    @Param("groupId") groupId: number,
    @Param("noticeId") noticeId: number,
  ) {
    return await this.noticeService.findNoticeDetail(groupId, noticeId);
  }

  @Post(":groupId/notice")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async createNotice(
    @Request() request: any,
    @Body() data: NoticeDto,
    @Param("groupId") groupId: number,
  ) {
    const userId = request.user.id;
    return await this.noticeService.createNotice(userId, groupId, data);
  }

  @Patch(":groupId/notice/:noticeId")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async updateNotice(
    @Param("noticeId") noticeId: number,
    @Body() dto: NoticeDto,
  ) {
    return await this.noticeService.updateNotice(noticeId, dto);
  }

  @Delete(":groupId/notice/:noticeId")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async deleteNotice(@Param("noticeId") noticeId: number) {
    return await this.noticeService.deleteNotice(noticeId);
  }

  /*
  가입 요청 조회, 생성, 승인
   */
  @Get(":groupId/membership/pending-list")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async findAllWaitUserByGroupId(@Param("groupId") groupId: number) {
    return this.membershipService.findAllWaitUserByGroupId(groupId);
  }

  @Post(":groupId/membership/approval")
  @UseGuards(AccessTokenGuard, AuthorizationManagementGuard)
  async approvalUser(
    @Param("groupId") groupId: number,
    @Query("userId") userId: number,
    @Query("status") status: Status,
  ) {
    return await this.membershipService.approvalOrRejectJoinGroup(
      userId,
      groupId,
      status,
    );
  }

  @Post(":groupId/membership/apply")
  @UseGuards(AccessTokenGuard)
  async applyUser(@Request() request: any, @Param("groupId") groupId: number) {
    const userId = request.user.id;
    return await this.membershipService.applyToJoinGroup(userId, groupId);
  }
}
