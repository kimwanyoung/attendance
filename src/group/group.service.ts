import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GroupModel } from './entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { GenderEnum } from '../user/const/gender.enum';
import { AuthService } from '../auth/auth.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupModel)
    private readonly groupRepository: Repository<GroupModel>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async createGroupByAccessToken(
    accessToken: string,
    groupData: CreateGroupDto,
  ) {
    const email = this.authService.verifyToken(accessToken).email;
    const user = await this.userService.getUserByEmail(email);

    const newGroup = this.groupRepository.create({
      title: groupData.title,
      owner: user,
      user: [user],
    });

    return await this.groupRepository.save(newGroup);
  }
}
