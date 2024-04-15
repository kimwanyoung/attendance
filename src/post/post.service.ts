import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../user/entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { MembershipService } from '../group-user/membership.service';
import { GroupService } from '../group/group.service';
import { calculateEndDate } from "../libs/calculateDate";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    private readonly membershipService: MembershipService,
    private readonly groupService: GroupService,
  ) {}

  async createPost(user: UserModel, groupId: number, postData: CreatePostDto) {
    await this.isCreatorValidation(user.id, groupId);

    const group = await this.groupService.findGroupById(groupId);

    const endDate = calculateEndDate(postData.voteDuration);

    const post = this.postRepository.create({
      author: user,
      group,
      title: postData.title,
      contents: postData.contents,
      location: postData.location,
      eventDate: postData.eventDate,
      endDate,
    });

    return await this.postRepository.save(post);
  }

  async findAllPosts(groupId: number) {
    return await this.postRepository.find({
      where: {
        group: { id: groupId },
      },
      relations: ['author'],
    });
  }

  async findPostById(groupId: number, postId: number) {
    return await this.postRepository.findOne({
      where: {
        id: postId,
        group: { id: groupId },
      },
    });
  }

  private async isCreatorValidation(userId: number, groupId: number) {
    const group = await this.groupService.findGroupById(groupId);
    if (userId !== group.creator.id) {
      throw new UnauthorizedException('글 작성 권한이 없습니다.');
    }
  }
}
