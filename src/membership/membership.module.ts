import { Module } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { MembershipController } from "./membership.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembershipModel } from "./entity/membership.entity";
import { GroupModel } from "../group/entity/group.entity";
import { UserModel } from "../user/entity/user.entity";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { GroupModule } from "../group/group.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipModel, UserModel, GroupModel]),
    AuthModule,
    UserModule,
    GroupModule,
  ],
  exports: [MembershipService],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
