import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from './poll-option.entity';
import { PollOptionsService } from './poll-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([PollOption])],
  providers: [PollOptionsService],
  exports: [PollOptionsService],
})
export class PollOptionsModule {}
