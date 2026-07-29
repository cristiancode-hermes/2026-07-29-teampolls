import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { PollsService } from '../polls/polls.service';
export declare class VotesService {
    private votesRepository;
    private pollsService;
    constructor(votesRepository: Repository<Vote>, pollsService: PollsService);
    cast(userId: number, pollId: number, optionId: number): Promise<Vote>;
    getResults(pollId: number): Promise<{
        optionId: number;
        text: string;
        count: number;
    }[]>;
    hasVoted(pollId: number, userId: number): Promise<boolean>;
    getUserVote(pollId: number, userId: number): Promise<{
        optionId: number;
    } | null>;
}
