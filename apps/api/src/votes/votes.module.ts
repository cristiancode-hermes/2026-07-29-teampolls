import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { PollsModule } from '../polls/polls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), PollsModule],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
