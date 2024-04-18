import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "./entity/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async createUser(
    user: Pick<UserModel, "email" | "password" | "gender" | "phone" | "name">,
  ) {
    await this.duplicateValidation(user.email, user.phone);

    const createdUser = this.userRepository.create({
      ...user,
    });

    return this.userRepository.save(createdUser);
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findAllUsers() {
    return await this.userRepository.find({
      relations: ["memberships", "createGroups"],
    });
  }

  async findUserById(userId: number) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  private async duplicateValidation(email: string, phone: string) {
    const emailExists = await this.userRepository.existsBy({ email });

    const phoneExists = await this.userRepository.existsBy({ phone });

    if (emailExists) {
      throw new BadRequestException("이미 존재하는 이메일입니다.");
    }

    if (phoneExists) {
      throw new BadRequestException("이미 존재하는 휴대전화입니다.");
    }
  }
}
