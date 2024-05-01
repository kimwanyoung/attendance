import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { AccessTokenGuard } from "../auth/guards/bearer-token.guard";

@Controller("membership")
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAllGroupsByUserId(@Request() request: any) {
    const userId = request.user.id;
    return await this.membershipService.findAllGroupsByUserId(userId);
  }
}
