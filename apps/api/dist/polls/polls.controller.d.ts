import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
export declare class PollsController {
    private pollsService;
    constructor(pollsService: PollsService);
    findAll(userId: number): Promise<import("./poll.entity").Poll[]>;
    findOne(id: number): Promise<import("./poll.entity").Poll>;
    create(userId: number, dto: CreatePollDto): Promise<import("./poll.entity").Poll>;
    close(id: number, userId: number): Promise<import("./poll.entity").Poll>;
    reopen(id: number, userId: number): Promise<import("./poll.entity").Poll>;
    remove(id: number, userId: number): Promise<void>;
}
