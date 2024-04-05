import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MembershipModel } from '../../group-user/entity/group-user.entity';
import { UserModel } from '../../user/entity/user.entity';

@Entity()
export class GroupModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => MembershipModel, (membership) => membership.group)
  memberships: MembershipModel[];

  @ManyToOne(() => UserModel, (user) => user.createGroups)
  @JoinColumn({ name: 'creatorId' })
  creator: UserModel;
}
