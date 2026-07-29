import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { PollsService } from '../polls/polls.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private pollsService: PollsService,
  ) {}

  async cast(userId: number, pollId: number, optionId: number): Promise<Vote> {
    const poll = await this.pollsService.findById(pollId);

    if (poll.status === 'closed') {
      throw new BadRequestException('This poll is closed');
    }

    if (poll.deadline && new Date(poll.deadline) < new Date()) {
      throw new BadRequestException('Poll deadline has passed');
    }

    // Check if user already voted
    const existing = await this.votesRepository.findOne({
      where: { pollId, userId },
    });
    if (existing) {
      throw new ConflictException('You have already voted on this poll');
    }

    // Validate option belongs to this poll
    const option = poll.options?.find((o) => o.id === optionId);
    if (!option) {
      throw new NotFoundException('Option not found in this poll');
    }

    const vote = this.votesRepository.create({ pollId, optionId, userId } as any);
    return this.votesRepository.save(vote) as unknown as Vote;
  }

  async getResults(pollId: number): Promise<{ optionId: number; text: string; count: number }[]> {
    const poll = await this.pollsService.findById(pollId);
    const votes = await this.votesRepository.find({
      where: { pollId },
    });

    return (poll.options ?? []).map((option) => ({
      optionId: option.id,
      text: option.text,
      count: votes.filter((v) => v.optionId === option.id).length,
    }));
  }

  async hasVoted(pollId: number, userId: number): Promise<boolean> {
    const vote = await this.votesRepository.findOne({
      where: { pollId, userId },
    });
    return !!vote;
  }

  async getUserVote(pollId: number, userId: number): Promise<{ optionId: number } | null> {
    const vote = await this.votesRepository.findOne({
      where: { pollId, userId },
    });
    return vote ? { optionId: vote.optionId } : null;
  }
}
