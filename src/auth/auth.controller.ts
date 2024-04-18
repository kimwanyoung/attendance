import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserModel } from "../user/entity/user.entity";
import { RefreshTokenGuard } from "./guards/bearer-token.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  @Post("login")
  login(@Body() user: Pick<UserModel, "email" | "password">) {
    return this.authService.login(user);
  }

  @Post("token/access")
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers("authorization") rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post("token/refresh")
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers("authorization") rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      refreshToken: newToken,
    };
  }
}
