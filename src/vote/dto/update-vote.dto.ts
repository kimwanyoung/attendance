import { VoteStatus } from "../const/vote.const";

export class UpdateVoteDto {
  userId: number;
  postId: number;
  groupId: number;
  voteStatus: VoteStatus;
}
