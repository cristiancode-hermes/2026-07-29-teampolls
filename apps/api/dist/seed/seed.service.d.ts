import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { Vote } from '../votes/vote.entity';
export declare class SeedService implements OnModuleInit {
    private configService;
    private usersRepo;
    private pollsRepo;
    private optionsRepo;
    private votesRepo;
    constructor(configService: ConfigService, usersRepo: Repository<User>, pollsRepo: Repository<Poll>, optionsRepo: Repository<PollOption>, votesRepo: Repository<Vote>);
    onModuleInit(): Promise<void>;
    seed(): Promise<void>;
}
