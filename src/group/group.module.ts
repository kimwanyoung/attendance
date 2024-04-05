import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModel } from './entity/group.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { GroupUserModule } from "../group-user/group-user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupModel]),
    UserModule,
    AuthModule,
  ],
  exports: [GroupService],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
