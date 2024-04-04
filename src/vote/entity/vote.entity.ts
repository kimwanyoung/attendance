import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from '../../user/entity/user.entity';
import { VotePostModel } from '../../vote-post/entity/vote-post.entity';

@Entity()
export class VoteModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel)
  user: UserModel;

  @ManyToOne(() => VotePostModel)
  posts: VotePostModel;

  @Column()
  result: boolean;
}
