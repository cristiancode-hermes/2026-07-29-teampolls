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
exports.VotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vote_entity_1 = require("./vote.entity");
const polls_service_1 = require("../polls/polls.service");
let VotesService = class VotesService {
    votesRepository;
    pollsService;
    constructor(votesRepository, pollsService) {
        this.votesRepository = votesRepository;
        this.pollsService = pollsService;
    }
    async cast(userId, pollId, optionId) {
        const poll = await this.pollsService.findById(pollId);
        if (poll.status === 'closed') {
            throw new common_1.BadRequestException('This poll is closed');
        }
        if (poll.deadline && new Date(poll.deadline) < new Date()) {
            throw new common_1.BadRequestException('Poll deadline has passed');
        }
        // Check if user already voted
        const existing = await this.votesRepository.findOne({
            where: { pollId, userId },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already voted on this poll');
        }
        // Validate option belongs to this poll
        const option = poll.options?.find((o) => o.id === optionId);
        if (!option) {
            throw new common_1.NotFoundException('Option not found in this poll');
        }
        const vote = this.votesRepository.create({ pollId, optionId, userId });
        return this.votesRepository.save(vote);
    }
    async getResults(pollId) {
        const poll = await this.pollsService.findById(pollId);
        const votes = await this.votesRepository.find({
            where: { pollId },
        });
        return (poll.options ?? []).map((option) => ({
            optionId: option.id,
            text: option.text,
            count: votes.filter((v) => v.optionId === option.id).length,
        }));
    }
    async hasVoted(pollId, userId) {
        const vote = await this.votesRepository.findOne({
            where: { pollId, userId },
        });
        return !!vote;
    }
    async getUserVote(pollId, userId) {
        const vote = await this.votesRepository.findOne({
            where: { pollId, userId },
        });
        return vote ? { optionId: vote.optionId } : null;
    }
};
exports.VotesService = VotesService;
exports.VotesService = VotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        polls_service_1.PollsService])
], VotesService);
//# sourceMappingURL=votes.service.js.map