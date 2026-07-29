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
exports.PollOptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const poll_option_entity_1 = require("./poll-option.entity");
let PollOptionsService = class PollOptionsService {
    optionsRepository;
    constructor(optionsRepository) {
        this.optionsRepository = optionsRepository;
    }
    async create(pollId, texts) {
        const saved = [];
        for (const text of texts) {
            const opt = this.optionsRepository.create({ pollId, text });
            const savedOpt = await this.optionsRepository.save(opt);
            saved.push(savedOpt);
        }
        return saved;
    }
    async findByPoll(pollId) {
        return this.optionsRepository.find({
            where: { pollId },
            relations: { votes: true },
        });
    }
};
exports.PollOptionsService = PollOptionsService;
exports.PollOptionsService = PollOptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(poll_option_entity_1.PollOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PollOptionsService);
//# sourceMappingURL=poll-options.service.js.map