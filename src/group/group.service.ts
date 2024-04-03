import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { GroupModel } from "./entity/group.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "../user/user.service";
import { GenderEnum } from "../user/const/gender.enum";

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupModel)
    private readonly groupRepository: Repository<GroupModel>,
    private readonly userService: UserService,
  ) {}

  async createGroup() {
    const user = await this.userService.createUser({
      email: 'test@email.com',
      age: 27,
      password: 'password',
      gender: GenderEnum.MALE,
      phone: '010-1234-1234',
      name: 'wanyoung',
    });

    const group = this.groupRepository.create({
      owner: user,
      user: [user],
    });

    return this.groupRepository.save(group);
  }
}
