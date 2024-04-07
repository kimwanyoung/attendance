import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModel } from '../user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entity/post.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MembershipModule } from '../group-user/membership.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel, UserModel]),
    AuthModule,
    UserModule,
    GroupModule,
    MembershipModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
