import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollOption } from './poll-option.entity';

@Injectable()
export class PollOptionsService {
  constructor(
    @InjectRepository(PollOption)
    private optionsRepository: Repository<PollOption>,
  ) {}

  async create(pollId: number, texts: string[]): Promise<PollOption[]> {
    const saved: PollOption[] = [];
    for (const text of texts) {
      const opt = this.optionsRepository.create({ pollId, text } as any);
      const savedOpt = await this.optionsRepository.save(opt) as unknown as PollOption;
      saved.push(savedOpt);
    }
    return saved;
  }

  async findByPoll(pollId: number): Promise<PollOption[]> {
    return this.optionsRepository.find({
      where: { pollId },
      relations: { votes: true },
    });
  }
}
