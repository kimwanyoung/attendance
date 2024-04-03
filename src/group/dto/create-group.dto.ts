import { PickType } from '@nestjs/mapped-types';
import { GroupModel } from '../entity/group.entity';

export class CreateGroupDto extends PickType(GroupModel, ['title']) {}
