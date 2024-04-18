import { PartialType, PickType } from "@nestjs/mapped-types";
import { PostModel } from "../entity/post.entity";
import { IsNumber } from "class-validator";

export class CreatePostDto extends PartialType(PostModel) {
  @IsNumber()
  voteDuration: number;
}
