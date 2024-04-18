import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MembershipModel } from "../../group-user/entity/membership.entity";
import { UserModel } from "../../user/entity/user.entity";

@Entity()
export class GroupModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: "creatorId" })
  creator: UserModel;
}
