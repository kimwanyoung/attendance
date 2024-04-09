import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../../user/entity/user.entity';
import { PostModel } from '../../post/entity/post.entity';
import { VoteStatus } from '../const/vote.const';
import { IsEnum } from 'class-validator';

@Entity()
export class VoteModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel)
  user: UserModel;

  @ManyToOne(() => PostModel)
  post: PostModel;

  @Column({
    type: 'enum',
    enum: VoteStatus,
  })
  @IsEnum(VoteStatus)
  vote_status: VoteStatus;
}
