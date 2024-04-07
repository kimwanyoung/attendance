import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './user/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { GroupModel } from './group/entity/group.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MembershipModule } from './group-user/membership.module';
import { MembershipModel } from './group-user/entity/membership.entity';
import { PostModule } from './post/post.module';
import { VoteModule } from './vote/vote.module';
import { PostModel } from './post/entity/post.entity';
import { VoteModel } from './vote/entities/vote.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [UserModel, GroupModel, MembershipModel, PostModel, VoteModel],
      synchronize: true,
    }),
    AuthModule,
    GroupModule,
    MembershipModule,
    PostModule,
    VoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
