import { VotesService } from './votes.service';
import { CastVoteDto } from './dto/cast-vote.dto';
export declare class VotesController {
    private votesService;
    constructor(votesService: VotesService);
    cast(userId: number, dto: CastVoteDto): Promise<import("./vote.entity").Vote>;
    results(pollId: number): Promise<{
        optionId: number;
        text: string;
        count: number;
    }[]>;
    status(pollId: number, userId: number): Promise<{
        optionId: number;
    } | null>;
}
