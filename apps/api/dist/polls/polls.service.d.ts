import { Repository } from 'typeorm';
import { Poll } from './poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { CreatePollDto } from './dto/create-poll.dto';
export declare class PollsService {
    private pollsRepository;
    private optionsRepository;
    constructor(pollsRepository: Repository<Poll>, optionsRepository: Repository<PollOption>);
    findAll(userId: number): Promise<Poll[]>;
    findById(id: number): Promise<Poll>;
    create(userId: number, dto: CreatePollDto): Promise<Poll>;
    close(id: number, userId: number): Promise<Poll>;
    reopen(id: number, userId: number): Promise<Poll>;
    remove(id: number, userId: number): Promise<void>;
}
