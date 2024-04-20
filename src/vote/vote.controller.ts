import {
  Body,
  Controller, Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { VoteService } from "./vote.service";
import { AccessTokenGuard } from "../auth/guards/bearer-token.guard";
import { VoteStatus } from "./const/vote.const";
import { UpdateVoteDto } from "./dto/update-vote.dto";

@Controller("vote")
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post("group/:groupId/post/:postId")
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

  @Get("/:postId")
  @UseGuards(AccessTokenGuard)
  async getVotesByPostId(
    @Request() request: any,
    @Param("postId") postId: number,
  ) {
    const user = request.user;
    return await this.voteService.findVotesByPostId(user.id, postId);
  }
}
