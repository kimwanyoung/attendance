import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PostModel } from "./entity/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "../user/entity/user.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { GroupService } from "../group/group.service";
import { calculateEndDate } from "../libs/calculateDate";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
  ) {}

  async createPost(user: UserModel, groupId: number, postData: CreatePostDto) {
    const group = await this.groupService.findGroupById(groupId);
    const endDate = calculateEndDate(postData.voteDuration);
    const post = this.postRepository.create({
      author: user,
      ...postData,
      group,
      endDate,
    });

    return await this.postRepository.save(post);
  }

  async findAllPosts(groupId: number) {
    const group = await this.groupService.findGroupById(groupId);
    const posts = await this.postRepository.find({
      where: {
        group: { id: groupId },
      },
      relations: ["author"],
    });
    return {
      group,
      posts,
    };
  }

  async findPostById(groupId: number, postId: number) {
    return await this.postRepository.findOne({
      where: {
        id: postId,
        group: { id: groupId },
      },
      relations: ["author"],
    });
  }

  async deletePost(postId: number) {
    return await this.postRepository.delete(postId);
  }
}
