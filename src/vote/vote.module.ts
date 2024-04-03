import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../user/entity/user.entity';
import { VoteModel } from './entity/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VoteModel])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
