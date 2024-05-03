import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserModel } from "../../user/entity/user.entity";
import { GroupModel } from "../../group/entity/group.entity";
import { Status } from "../const/status.const";

@Entity()
export class MembershipModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel)
  user: UserModel;

  @ManyToOne(() => GroupModel, {
    onDelete: "CASCADE",
  })
  group: GroupModel;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;
}
