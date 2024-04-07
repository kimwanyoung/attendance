import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { MembershipModel } from './entity/group-user.entity';
import { Status } from './const/status.const';
import { ApprovalDto } from './dto/approval.dto';
import { GroupModel } from '../group/entity/group.entity';

@Injectable()
export class GroupUserService {
  constructor(
    @InjectRepository(MembershipModel)
    private readonly membershipRepository: Repository<MembershipModel>,
  ) {}

  async applyToJoinGroup(user: UserModel, groupId: number) {
    const existsUser = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: user.id },
      },
    });

    if (existsUser) {
      throw new BadRequestException('이미 가입된 유저입니다.');
    }

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
      },
      relations: ['user'],
    });

    return waitList;
  }

  async approvalJoinGroup(creatorId: number, approvalDto: ApprovalDto) {
    const { userId, groupId } = approvalDto;
    const findGroup = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ['group', 'group.creator'],
    });

    if (!findGroup) {
      throw new NotFoundException('그룹이 없습니다.');
    }

    if (creatorId !== findGroup.group.creator.id) {
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

  async createMembership(user: UserModel, group: GroupModel, status: Status) {
    return this.membershipRepository.create({
      user,
      group,
      status,
    });
  }
}
