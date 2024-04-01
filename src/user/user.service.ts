import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum } from './const/gender.enum';
import { UserModel } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async createUserData() {
    const user = this.userRepository.create({
      email: 'testeamil@gmail.com',
      age: 20,
      gender: GenderEnum.FEMALE,
      name: '완영',
      password: 'password',
      phone: '010-9483-5869',
    });

    return await this.userRepository.save(user);
  }
}
