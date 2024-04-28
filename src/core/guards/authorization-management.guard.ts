import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GroupService } from "../../group/group.service";

@Injectable()
export class AuthorizationManagementGuard implements CanActivate {
  constructor(private readonly groupService: GroupService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const groupId = request.body["groupId"];
    const group = await this.groupService.findGroupById(groupId);

    if (request.user.id !== group.creator.id) {
      throw new UnauthorizedException("권한이 없습니다.");
    }

    return true;
  }
}