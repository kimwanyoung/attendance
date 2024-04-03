import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { GenderEnum } from '../const/gender.enum';
import { VotePostModel } from '../../vote-post/entity/vote-post.entity';
import { VoteModel } from '../../vote/entity/vote.entity';
import { GroupModel } from '../../group/entity/group.entity';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  age: number;

  @Column({
    type: 'enum',
    enum: GenderEnum,
  })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  phone: string;

  @OneToMany(() => VoteModel, (vote) => vote.user, { nullable: true })
  votes: VoteModel[];

  @OneToMany(() => VotePostModel, (post) => post.author, { nullable: true })
  posts: VotePostModel[];

  @ManyToMany(() => GroupModel, (group) => group.user)
  @JoinTable()
  group: GroupModel[];

  @OneToMany(() => GroupModel, (group) => group.owner)
  create_group: GroupModel;
}
