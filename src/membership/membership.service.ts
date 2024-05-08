import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MembershipModel } from "./entity/membership.entity";
import { Status } from "./const/status.const";

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MembershipModel)
    private readonly membershipRepository: Repository<MembershipModel>,
  ) {}

  async applyToJoinGroup(userId: number, groupId: number) {
    const existsUser = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
      },
    });

    if (existsUser) {
      throw new BadRequestException("이미 가입된 유저입니다.");
    }

    const membership = this.membershipRepository.create({
      user: { id: userId },
      group: { id: groupId },
      status: Status.PENDING,
    });

    return this.membershipRepository.save(membership);
  }

  async approvalOrRejectJoinGroup(
    userId: number,
    groupId: number,
    status: Status,
  ) {
    const findGroup = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
      },
      relations: ["group", "group.creator"],
    });

    if (!findGroup) {
      throw new NotFoundException("그룹이 없습니다.");
    }

    const findUser = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
        status: Status.PENDING,
      },
    });
    findUser.status = status;
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
          .where("membership.groupId = group.id")
          .andWhere("membership.status = :status", { status: Status.APPROVED });
      }, "memberCount")
      .groupBy("group.id")
      .getRawMany();

    return groups.map((group) => ({
      ...group,
      memberCount: parseInt(group.memberCount, 10),
    }));
  }

  async findAllWaitUserByGroupId(groupId: number) {
    return await this.membershipRepository.find({
      where: {
        group: { id: groupId },
        status: Status.PENDING,
      },
      relations: ["user"],
    });
  }
}
