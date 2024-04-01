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
      entities: [UserModel, VoteModel, VotePostModel],
      synchronize: true,
    }),
    VoteModule,
    VotePostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
