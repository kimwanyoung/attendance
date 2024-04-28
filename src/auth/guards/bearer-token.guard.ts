import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UserService } from "../../user/user.service";
import { GroupService } from "../../group/group.service";

@Injectable()
abstract class BearerTokenGuard implements CanActivate {
  constructor(
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const rawToken = request.headers["authorization"];

    if (!rawToken) {
      throw new BadRequestException("토큰이 없습니다.");
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const result = await this.authService.verifyToken(token);
    const user = await this.userService.findUserByEmail(result.email);

    request.user = user;
    request.token = token;
    request.tokenType = result.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActive(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== "access") {
      throw new UnauthorizedException("Access Token이 아닙니다.");
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActive(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== "refresh") {
      throw new UnauthorizedException("Refresh Token이 아닙니다.");
    }

    return true;
  }
}

@Injectable()
export class AuthorizationManagementGuard extends BearerTokenGuard {
  constructor(
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {
    super(authService, userService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();

    const groupId = request.body["groupId"];
    const group = await this.groupService.findGroupById(groupId);

    if (request.user.id !== group.creator.id) {
      throw new UnauthorizedException("권한이 없습니다.");
    }

    return true;
  }
}
