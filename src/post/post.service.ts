import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../user/entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { MembershipService } from '../group-user/membership.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    private readonly membershipService: MembershipService,
  ) {}

  async createPost(user: UserModel, groupId: number, postData: CreatePostDto) {
    await this.isCreatorValidation(user.id, groupId);

    const membership =
      await this.membershipService.findMembershipByGroupId(groupId);
    const post = this.postRepository.create({
      user,
      group: membership.group,
      ...postData,
    });

    return await this.postRepository.save(post);
  }

  async findAllPosts(groupId: number) {
    return await this.postRepository.find({
      where: {
        group: { id: groupId },
      },
      relations: ['user', 'group'],
    });
  }

  private async isCreatorValidation(userId: number, groupId: number) {
    const membership =
      await this.membershipService.findMembershipByGroupId(groupId);
    if (userId !== membership.group.creator.id) {
      throw new UnauthorizedException('글 작성 권한이 없습니다.');
    }
  }
}
