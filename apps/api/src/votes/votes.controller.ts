import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CastVoteDto } from './dto/cast-vote.dto';

@ApiTags('Votes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  cast(@CurrentUser('id') userId: number, @Body() dto: CastVoteDto) {
    return this.votesService.cast(userId, dto.pollId, dto.optionId);
  }

  @Get('results/:pollId')
  results(@Param('pollId', ParseIntPipe) pollId: number) {
    return this.votesService.getResults(pollId);
  }

  @Get('status/:pollId')
  status(@Param('pollId', ParseIntPipe) pollId: number, @CurrentUser('id') userId: number) {
    return this.votesService.getUserVote(pollId, userId);
  }
}
