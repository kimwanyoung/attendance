import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import { MembershipModel } from "./entity/membership.entity";
import { Status } from "./const/status.const";
import { ApprovalDto } from "./dto/approval.dto";
import { GroupService } from "../group/group.service";

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MembershipModel)
    private readonly membershipRepository: Repository<MembershipModel>,
    private readonly groupService: GroupService,
  ) {}

  async applyToJoinGroup(user: UserModel, groupId: number) {
    const existsUser = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: user.id },
      },
    });

    if (existsUser) {
      throw new BadRequestException("이미 가입된 유저입니다.");
    }

    const membership = this.membershipRepository.create({
      user,
      group: { id: groupId },
      status: Status.PENDING,
    });

    return this.membershipRepository.save(membership);
  }

  async approvalOrRejectJoinGroup(creatorId: number, approvalDto: ApprovalDto) {
    const { userId, groupId } = approvalDto;
    const findGroup = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ["group", "group.creator"],
    });

    if (!findGroup) {
      throw new NotFoundException("그룹이 없습니다.");
    }

    if (creatorId !== findGroup.group.creator.id) {
      throw new UnauthorizedException("권한이 없습니다.");
    }

    const findUser = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
        status: Status.PENDING,
      },
    });
    findUser.status = approvalDto.status;
    return await this.membershipRepository.save(findUser);
  }

  async findAllGroupsByUserId(userId: number) {
    const groups = await this.membershipRepository
      .createQueryBuilder("membership")
      .leftJoinAndSelect("membership.group", "group")
      .leftJoin("membership.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("membership.status = :status", { status: Status.APPROVED })
      .select([
        "group.id AS id",
        "group.title AS title",
        "group.description AS description",
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(membership.id)", "memberCount")
          .from(MembershipModel, "membership")
          .where("membership.groupId = group.id");
      }, "memberCount")
      .groupBy("group.id")
      .getRawMany();

    return groups.map((group) => ({
      ...group,
      memberCount: parseInt(group.memberCount, 10),
    }));
  }

  async findAllWaitUserByGroupId(userId: number, groupId: number) {
    const group = await this.groupService.findGroupById(groupId);
    if (group.creator.id !== userId) {
      throw new UnauthorizedException("그룹 생성자만 접근 가능합니다.");
    }

    return await this.membershipRepository.find({
      where: {
        group: { id: groupId },
        status: Status.PENDING,
      },
      relations: ["user"],
    });
  }
}
