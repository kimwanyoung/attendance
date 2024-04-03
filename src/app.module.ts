import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotePostModule } from './vote-post/vote-post.module';
import { VoteModule } from './vote/vote.module';
import { UserModel } from './user/entity/user.entity';
import { VoteModel } from './vote/entity/vote.entity';
import { VotePostModel } from './vote-post/entity/vote-post.entity';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { GroupModel } from './group/entity/group.entity';

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
      entities: [UserModel, VoteModel, VotePostModel, GroupModel],
      synchronize: true,
    }),
    VoteModule,
    VotePostModule,
    AuthModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
