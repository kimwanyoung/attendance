import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { GroupModule } from "./group/group.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MembershipModule } from "./membership/membership.module";
import { PostModule } from "./post/post.module";
import { VoteModule } from "./vote/vote.module";
import { NoticeModule } from "./notice/notice.module";
import * as process from "process";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOSTNAME,
      port: parseInt(process.env.DB_PORT ?? "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/*.entity.*"],
      synchronize: true,
    }),
    AuthModule,
    GroupModule,
    MembershipModule,
    PostModule,
    VoteModule,
    NoticeModule,
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
