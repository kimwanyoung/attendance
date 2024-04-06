import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GroupModel } from './entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UserModel } from '../user/entity/user.entity';
import { GroupUserService } from '../group-user/group-user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupModel)
    private readonly groupRepository: Repository<GroupModel>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async createNewGroup(user: UserModel, groupData: CreateGroupDto) {
    const newGroup = this.groupRepository.create({
      creator: user,
      memberships: [user],
      ...groupData,
    });

    return await this.groupRepository.save(newGroup);
  }

  async findGroupById(groupId: number) {
    return await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: ['creator', 'memberships'],
    });
  }
}
