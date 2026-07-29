import { Poll } from '../polls/poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { User } from '../users/user.entity';
export declare class Vote {
    id: number;
    pollId: number;
    poll: Poll;
    optionId: number;
    option: PollOption;
    userId: number;
    user: User;
    createdAt: Date;
}
