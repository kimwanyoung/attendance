import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../../user/entity/user.entity';

@Entity()
export class GroupModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserModel, (user) => user.group)
  user: UserModel[];

  @ManyToOne(() => UserModel, { nullable: false })
  owner: UserModel;
}
