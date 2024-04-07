import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "../../user/entity/user.entity";
import { PostModel } from "../../post/entity/post.entity";

@Entity()
export class VoteModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel)
  user: UserModel;

  @ManyToOne(() => PostModel)
  post: PostModel;
}
