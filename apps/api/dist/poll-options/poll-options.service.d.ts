import { Repository } from 'typeorm';
import { PollOption } from './poll-option.entity';
export declare class PollOptionsService {
    private optionsRepository;
    constructor(optionsRepository: Repository<PollOption>);
    create(pollId: number, texts: string[]): Promise<PollOption[]>;
    findByPoll(pollId: number): Promise<PollOption[]>;
}
