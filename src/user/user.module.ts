import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "./entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
