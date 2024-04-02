import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../../user/entity/user.entity';

export class RegisterUserDto extends PickType(UserModel, [
  'email',
  'name',
  'age',
  'gender',
  'phone',
  'password',
]) {}
