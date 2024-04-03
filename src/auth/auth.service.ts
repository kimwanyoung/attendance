import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { HASH_ROUND, JWT_SECRET } from './const/auth.const';
import { UserModel } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(user: RegisterUserDto) {
    const hash = await bcrypt.hash(user.password, HASH_ROUND);

    return this.userService.createUser({
      ...user,
      password: hash,
    });
  }

  async login(user: Pick<UserModel, 'email' | 'password'>) {
    const existUser = await this.userValidate(user);

    return {
      accessToken: this.signToken(existUser, false),
      refreshToken: this.signToken(existUser, true),
    };
  }

  private async userValidate(user: Pick<UserModel, 'email' | 'password'>) {
    const existUser = await this.existUserValidate(user.email);
    const passOk = await bcrypt.compare(user.password, existUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existUser;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String).toString('utf-8');
    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];

    return email;
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  private async existUserValidate(email: string) {
    const existUser = await this.userService.getUserByEmail(email);

    if (!existUser) {
      throw new BadRequestException('존재하지않는 이메일입니다.');
    }

    return existUser;
  }

  private signToken(
    user: Pick<UserModel, 'email' | 'name'>,
    isRefreshToken: boolean,
  ) {
    const payload = {
      email: user.email,
      name: user.name,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }
}
