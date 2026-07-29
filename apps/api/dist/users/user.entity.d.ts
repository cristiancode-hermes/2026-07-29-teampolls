import { Poll } from '../polls/poll.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    polls: Poll[];
}
