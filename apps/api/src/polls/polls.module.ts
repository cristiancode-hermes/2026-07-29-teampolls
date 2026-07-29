import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption])],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService],
})
export class PollsModule {}
