import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from '../../user/entity/user.entity';
import { VoteModel } from '../../vote/entity/vote.entity';

@Entity()
export class VotePostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => VoteModel, (vote) => vote.posts)
  votes: VoteModel[];

  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;
}
