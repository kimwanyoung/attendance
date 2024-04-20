import {
  forwardRef,
  Inject,
  Injectable, Logger,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { VoteModel } from "./entities/vote.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateVoteDto } from "./dto/update-vote.dto";
import { GroupService } from "../group/group.service";
import { PostService } from "../post/post.service";
import { UserService } from "../user/user.service";
import { VoteStatus } from "./const/vote.const";

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteModel)
    private readonly voteRepository: Repository<VoteModel>,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async voteOnPost(updateVoteData: UpdateVoteDto) {
    const { userId, groupId, postId, voteStatus } = updateVoteData;
    const group = await this.groupService.findGroupById(groupId);
    if (!group) {
      throw new NotFoundException("그룹이 존재하지 않습니다.");
    }

    const post = await this.postService.findPostById(groupId, postId);
    if (!post) {
      throw new NotFoundException("게시글이 존재하지 않습니다.");
    }

    const existUserVote = await this.voteRepository.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });

    if (existUserVote) {
      existUserVote.voteStatus = voteStatus;
      return await this.voteRepository.save(existUserVote);
    }

    const user = await this.userService.findUserById(userId);
    const vote = this.voteRepository.create({
      user,
      post,
      voteStatus,
    });

    return await this.voteRepository.save(vote);
  }

  async findVotesByPostId(userId: number, postId: number) {
    const votes = await this.voteRepository.find({
      where: {
        post: { id: postId },
      },
      relations: ["user"],
    });

    let userStatus: VoteStatus;
    const filteredVotes = votes.filter((vote) => vote.user.id === userId);
    if (filteredVotes.length === 0) {
      userStatus = VoteStatus.NOT_VOTED_YET;
    } else {
      userStatus = votes.find((vote) => vote.user.id === userId).voteStatus;
    }
    return {
      currentUserStatus: userStatus,
      allVotes: votes,
    };
  }
}
