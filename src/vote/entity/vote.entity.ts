import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from '../../user/entity/user.entity';
import { VotePostModel } from '../../vote-post/entity/vote-post.entity';

@Entity()
export class VoteModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserModel, (user) => user.votes)
  user: UserModel[];

  @ManyToMany(() => VotePostModel, (post) => post.votes)
  posts: VotePostModel[];

  @Column()
  result: boolean;
}
