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
import { GroupUserModule } from './group-user/group-user.module';
import { MembershipModel } from './group-user/entity/group-user.entity';

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
      entities: [UserModel, GroupModel, MembershipModel],
      synchronize: true,
    }),
    AuthModule,
    GroupModule,
    GroupUserModule,
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
