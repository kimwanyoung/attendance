import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from '../../user/entity/user.entity';

@Entity()
export class GroupModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => UserModel, (user) => user.group)
  @JoinTable()
  user: UserModel[];

  @ManyToOne(() => UserModel, {
    nullable: false,
  })
  owner: UserModel;
}
