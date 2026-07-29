import { Poll } from '../polls/poll.entity';
import { Vote } from '../votes/vote.entity';
export declare class PollOption {
    id: number;
    pollId: number;
    poll: Poll;
    text: string;
    votes: Vote[];
}
