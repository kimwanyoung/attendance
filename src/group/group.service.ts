import { Injectable } from "@nestjs/common";
import { EntityManager, Like, Repository } from "typeorm";
import { GroupModel } from "./entity/group.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UserModel } from "../user/entity/user.entity";
import { MembershipModel } from "../membership/entity/membership.entity";
import { Status } from "../membership/const/status.const";

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupModel)
    private readonly groupRepository: Repository<GroupModel>,
    private readonly entityManager: EntityManager,
  ) {}

  async createNewGroup(user: UserModel, groupData: CreateGroupDto) {
    return await this.entityManager.transaction(async (transactionEm) => {
      const newGroup = transactionEm.create(GroupModel, {
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
      relations: ["creator"],
    });
  }

  async findGroupByName(groupName: string, groupCreatorName: string) {
    const whereConditions = {};

    if (groupName.trim()) {
      whereConditions["title"] = Like(`%${groupName}%`);
    }

    if (groupCreatorName.trim()) {
      whereConditions["creator"] = { name: groupCreatorName };
    }

    if (!groupName.trim() && groupCreatorName.trim()) {
      return [];
    }

    return await this.groupRepository.find({
      where: whereConditions,
      relations: ["creator"],
    });
  }

  async delete(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
    });

    return await this.groupRepository.delete(group);
  }
}
