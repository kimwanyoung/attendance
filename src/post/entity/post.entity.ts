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
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  contents: string;

  @Column()
  location: string;

  @Column()
  eventDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserModel)
  author: UserModel;

  @ManyToOne(() => GroupModel)
  group: GroupModel;
}
