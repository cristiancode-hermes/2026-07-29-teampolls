"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const poll_entity_1 = require("./poll.entity");
const poll_option_entity_1 = require("../poll-options/poll-option.entity");
let PollsService = class PollsService {
    pollsRepository;
    optionsRepository;
    constructor(pollsRepository, optionsRepository) {
        this.pollsRepository = pollsRepository;
        this.optionsRepository = optionsRepository;
    }
    async findAll(userId) {
        return this.pollsRepository.find({
            where: { createdById: userId },
            relations: { options: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const poll = await this.pollsRepository.findOne({
            where: { id },
            relations: { options: true, createdBy: true },
        });
        if (!poll)
            throw new common_1.NotFoundException('Poll not found');
        return poll;
    }
    async create(userId, dto) {
        const poll = this.pollsRepository.create({
            title: dto.title,
            description: dto.description ?? null,
            deadline: dto.deadline ? new Date(dto.deadline) : null,
            isAnonymous: dto.isAnonymous ?? false,
            status: 'open',
            createdById: userId,
        });
        const savedPoll = await this.pollsRepository.save(poll);
        // Create options for the poll
        for (const text of dto.options) {
            const opt = this.optionsRepository.create({ pollId: savedPoll.id, text });
            await this.optionsRepository.save(opt);
        }
        return this.findById(savedPoll.id);
    }
    async close(id, userId) {
        const poll = await this.findById(id);
        if (poll.createdById !== userId) {
            throw new common_1.ForbiddenException('Only the creator can close this poll');
        }
        poll.status = 'closed';
        return this.pollsRepository.save(poll);
    }
    async reopen(id, userId) {
        const poll = await this.findById(id);
        if (poll.createdById !== userId) {
            throw new common_1.ForbiddenException('Only the creator can reopen this poll');
        }
        poll.status = 'open';
        return this.pollsRepository.save(poll);
    }
    async remove(id, userId) {
        const poll = await this.findById(id);
        if (poll.createdById !== userId) {
            throw new common_1.ForbiddenException('Only the creator can delete this poll');
        }
        await this.pollsRepository.remove(poll);
    }
};
exports.PollsService = PollsService;
exports.PollsService = PollsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(poll_entity_1.Poll)),
    __param(1, (0, typeorm_1.InjectRepository)(poll_option_entity_1.PollOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PollsService);
//# sourceMappingURL=polls.service.js.map