import {
  Column,
  Entity,
  IsNull,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { GenderEnum } from '../const/gender.enum';
import { GroupModel } from '../../group/entity/group.entity';
import { Exclude } from 'class-transformer';
import { MembershipModel } from '../../group-user/entity/group-user.entity';
import { Status } from "../../group-user/const/status.const";

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

  @Exclude({ toPlainOnly: true })
  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  phone: string;

  @OneToMany(() => MembershipModel, (membership) => membership.user)
  memberships: MembershipModel[];

  @OneToMany(() => GroupModel, (group) => group.creator)
  createGroups: GroupModel[];
}
