import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserModel } from "../../user/entity/user.entity";
import { GroupModel } from "../../group/entity/group.entity";

@Entity()
export class NoticeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  contents: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserModel)
  author: UserModel;

  @ManyToOne(() => GroupModel)
  group: GroupModel;
}
