import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { UserModel } from "../user/entity/user.entity";
import { GenderEnum } from "../user/const/gender.enum";
import { HASH_ROUND } from "./const/auth.const";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let users: UserModel[];
  let service: AuthService;
  let mockedUserService: Partial<UserService>;

  beforeEach(async () => {
    users = [];
    mockedUserService = {
      createUser: async function (
        user: Pick<
          UserModel,
          "email" | "password" | "gender" | "phone" | "name"
        >,
      ): Promise<UserModel> {
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
});
