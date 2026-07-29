import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { Vote } from '../votes/vote.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Poll, PollOption, Vote]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
