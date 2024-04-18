import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "./entity/user.entity";
import { MembershipModule } from "../group-user/membership.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
