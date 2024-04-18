import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { AccessTokenGuard } from "../auth/guards/bearer-token.guard";
import { CreatePostDto } from "./dto/create-post.dto";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(":groupId")
  @UseGuards(AccessTokenGuard)
  async findAllPostsByGroupId(@Param("groupId") groupId: number) {
    return this.postService.findAllPosts(groupId);
  }

  @Post(":groupId")
  @UseGuards(AccessTokenGuard)
  async createPost(
    @Request() request: any,
    @Param("groupId") groupId: number,
    @Body() postData: CreatePostDto,
  ) {
    const user = request.user;
    return await this.postService.createPost(user, groupId, postData);
  }
}
