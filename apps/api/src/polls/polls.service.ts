import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private optionsRepository: Repository<PollOption>,
  ) {}

  async findAll(userId: number): Promise<Poll[]> {
    return this.pollsRepository.find({
      where: { createdById: userId },
      relations: { options: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({
      where: { id },
      relations: { options: true, createdBy: true },
    });
    if (!poll) throw new NotFoundException('Poll not found');
    return poll;
  }

  async create(userId: number, dto: CreatePollDto): Promise<Poll> {
    const poll = this.pollsRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      isAnonymous: dto.isAnonymous ?? false,
      status: 'open',
      createdById: userId,
    } as any);
    const savedPoll = await this.pollsRepository.save(poll) as unknown as Poll;

    // Create options for the poll
    for (const text of dto.options) {
      const opt = this.optionsRepository.create({ pollId: savedPoll.id, text } as any);
      await this.optionsRepository.save(opt) as unknown as PollOption;
    }

    return this.findById(savedPoll.id);
  }

  async close(id: number, userId: number): Promise<Poll> {
    const poll = await this.findById(id);
    if (poll.createdById !== userId) {
      throw new ForbiddenException('Only the creator can close this poll');
    }
    poll.status = 'closed';
    return this.pollsRepository.save(poll) as unknown as Poll;
  }

  async reopen(id: number, userId: number): Promise<Poll> {
    const poll = await this.findById(id);
    if (poll.createdById !== userId) {
      throw new ForbiddenException('Only the creator can reopen this poll');
    }
    poll.status = 'open';
    return this.pollsRepository.save(poll) as unknown as Poll;
  }

  async remove(id: number, userId: number): Promise<void> {
    const poll = await this.findById(id);
    if (poll.createdById !== userId) {
      throw new ForbiddenException('Only the creator can delete this poll');
    }
    await this.pollsRepository.remove(poll);
  }
}
