import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { GroupUserController } from './group-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipModel } from './entity/group-user.entity';
import { GroupModel } from '../group/entity/group.entity';
import { UserModel } from '../user/entity/user.entity';
import { GroupModule } from '../group/group.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipModel, UserModel, GroupModel]),
    AuthModule,
    UserModule,
    GroupModule,
  ],
  controllers: [GroupUserController],
  providers: [GroupUserService],
})
export class GroupUserModule {}
