import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { UserModel } from "../user/entity/user.entity";
import { GenderEnum } from "../user/const/gender.enum";
import { HASH_ROUND } from "./const/auth.const";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let users: UserModel[];
  let service: AuthService;
  let mockedUserService: Partial<UserService>;

  beforeEach(async () => {
    users = [];
    mockedUserService = {
      async createUser(
        user: Pick<
          UserModel,
          "email" | "password" | "gender" | "phone" | "name"
        >,
      ): Promise<UserModel> {
        if (await this.findUserByEmail(user.email)) {
          throw new BadRequestException();
        }
        users.push(user as UserModel);
        return Promise.resolve({ ...user } as UserModel);
      },
      async findUserByEmail(email: string): Promise<UserModel> {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user[0]);
      },
    };

    const hash = await bcrypt.hash("password", HASH_ROUND);
    await mockedUserService.createUser({
      email: "dhks2869@gmail.com",
      password: hash,
      phone: "01012341234",
      gender: GenderEnum.MALE,
      name: "김완영",
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("올바른 이메일, 비밀번호를 입력하면 로그인에 성공한다.", async () => {
    const hash = await bcrypt.hash("password", HASH_ROUND);
    await mockedUserService.createUser({
      email: "dhks2869@gmail.com",
      password: hash,
      phone: "01012341234",
      gender: GenderEnum.MALE,
      name: "김완영",
    });

    const user = await service.authenticateWithEmailAndPassword({
      email: "dhks2869@gmail.com",
      password: "password",
    });

    expect(user.email).toEqual("dhks2869@gmail.com");
  });

  it("올바르지 않은 비밀번호를 입력하면 UnauthorizationException이 발생한다.", async () => {
    await expect(
      service.authenticateWithEmailAndPassword({
        email: "dhks2869@gmail.com",
        password: "aaaa",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("존재하지 않은 이메일을 입력하면 UnauthorizationException이 발생한다.", async () => {
    await expect(
      service.authenticateWithEmailAndPassword({
        email: "dhks2869@naver.com",
        password: "password",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("refresh token으로 토큰 재발급을 요청하면 access token을 반환한다.", async () => {
    const { refreshToken } = await service.login({
      email: "dhks2869@gmail.com",
      password: "password",
    });
    expect(service.rotateToken(refreshToken, false)).toBeDefined();
  });

  it("refresh token이 아닌 토큰으로 재발급을 요청하면 UnauthorizedException이 발생한다.", async () => {
    const { accessToken } = await service.login({
      email: "dhks2869@gmail.com",
      password: "password",
    });

    await expect(async () =>
      service.rotateToken(accessToken, false),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("유저 정보를 입력하면 정상적으로 회원가입과 동시에 로그인 처리가 된다.", async () => {
    const { accessToken, refreshToken } = await service.register({
      name: "김완영",
      email: "dhks2869@naver.com",
      password: "password",
      gender: GenderEnum.MALE,
      phone: "01012341234",
    });

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("이미 존재하는 이메일로 회원가입을 하면 BadRequestException이 발생한다.", async () => {
    await expect(
      service.register({
        name: "김완영",
        email: "dhks2869@gmail.com",
        password: "password",
        gender: GenderEnum.MALE,
        phone: "01012341234",
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
