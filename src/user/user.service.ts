import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async createUser(
    user: Pick<
      UserModel,
      'email' | 'password' | 'age' | 'gender' | 'phone' | 'name'
    >,
  ) {
    this.emailExistValidation(user.email);

    const createdUser = this.userRepository.create({
      ...user,
    });

    return this.userRepository.save(createdUser);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  private async emailExistValidation(email: string) {
    const emailExists = await this.userRepository.exists({
      where: {
        email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }
  }
}
