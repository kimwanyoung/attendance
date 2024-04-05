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

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    return splitToken[1];
  }

  decodeBasicToken(base64string: string) {
    const decode = Buffer.from(base64string).toString('utf-8');
    const splited = decode.split(':');

    if (splited.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    return {
      email: splited[0],
      password: splited[1],
    };
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 RefreshToken으로만 가능합니다.',
      );
    }

    return this.signToken({ ...decoded }, isRefreshToken);
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const existUser = await this.userService.getUserByEmail(user.email);

    if (!existUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const passOk = bcrypt.compare(user.password, existUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existUser;
  }

  private async userValidate(user: Pick<UserModel, 'email' | 'password'>) {
    const existUser = await this.existUserValidate(user.email);
    const passOk = await bcrypt.compare(user.password, existUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existUser;
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
