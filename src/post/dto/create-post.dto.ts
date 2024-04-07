import { PickType } from '@nestjs/mapped-types';
import { PostModel } from '../entity/post.entity';

export class CreatePostDto extends PickType(PostModel, ['title', 'contents']) {}
