import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum } from './const/gender.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
