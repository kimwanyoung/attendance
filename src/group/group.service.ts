import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { GroupModel } from './entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UserModel } from '../user/entity/user.entity';
import { MembershipModel } from '../group-user/entity/membership.entity';
import { Status } from '../group-user/const/status.const';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupModel)
    private readonly groupRepository: Repository<GroupModel>,
    private readonly entityManager: EntityManager,
  ) {}

  async createNewGroup(user: UserModel, groupData: CreateGroupDto) {
    return await this.entityManager.transaction(async (transactionEm) => {
      const newGroup = this.groupRepository.create({
        creator: user,
        ...groupData,
      });

      await transactionEm.save(newGroup);

      const membership = transactionEm.create(MembershipModel, {
        user: user,
        group: newGroup,
        status: Status.APPROVED,
      });

      await transactionEm.save(membership);

      return newGroup;
    });
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
