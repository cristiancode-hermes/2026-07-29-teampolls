import { User } from '../users/user.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { Vote } from '../votes/vote.entity';
export type PollStatus = 'open' | 'closed';
export declare class Poll {
    id: number;
    title: string;
    description: string | null;
    createdById: number;
    createdBy: User;
    createdAt: Date;
    deadline: Date | null;
    isAnonymous: boolean;
    status: PollStatus;
    options: PollOption[];
    votes: Vote[];
}
