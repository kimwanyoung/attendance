import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import { MembershipModel } from "./entity/group-user.entity";
import { Status } from "./const/status.const";
import { ApprovalDto } from "./dto/approval.dto";
import { GroupService } from "../group/group.service";

@Injectable()
export class GroupUserService {
  constructor(
    @InjectRepository(MembershipModel)
    private readonly membershipRepository: Repository<MembershipModel>,
    private readonly groupService: GroupService,
  ) {}

  async applyToJoinGroup(user: UserModel, groupId: number) {
    const membership = this.membershipRepository.create({
      user,
      group: { id: groupId },
      status: Status.PENDING,
    });

    return this.membershipRepository.save(membership);
  }

  async findWaitListByGroupId(groupId: number) {
    const waitList = await this.membershipRepository.find({
      where: {
        group: { id: groupId },
        status: Status.PENDING,
      },
      relations: ['user'],
    });

    return waitList;
  }

  async approvalJoinGroup(creatorId: number, approvalDto: ApprovalDto) {
    const { userId, groupId } = approvalDto;
    const findGroup = await this.groupService.findGroupById(groupId);

    if (creatorId !== findGroup.creator.id) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const findUser = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
      },
    });
    findUser.status = Status.APPROVED;
    return await this.membershipRepository.save(findUser);
  }
}
