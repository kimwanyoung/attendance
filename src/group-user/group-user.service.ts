import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import { MembershipModel } from "./entity/group-user.entity";
import { GroupService } from "../group/group.service";
import { Status } from "./const/status.const";

@Injectable()
export class GroupUserService {
  constructor(
    @InjectRepository(MembershipModel)
    private readonly membershipRepository: Repository<MembershipModel>,
    private readonly groupService: GroupService,
  ) {}

  async applyToJoinGroup(user: UserModel, groupId: number) {
    const group = await this.groupService.findGroupById(groupId);
    const membership = this.membershipRepository.create({
      user,
      group,
      status: Status.PENDING,
    });

    return this.membershipRepository.save(membership);
  }
}
