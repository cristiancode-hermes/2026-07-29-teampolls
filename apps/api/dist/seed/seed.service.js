"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../users/user.entity");
const poll_entity_1 = require("../polls/poll.entity");
const poll_option_entity_1 = require("../poll-options/poll-option.entity");
const vote_entity_1 = require("../votes/vote.entity");
let SeedService = class SeedService {
    configService;
    usersRepo;
    pollsRepo;
    optionsRepo;
    votesRepo;
    constructor(configService, usersRepo, pollsRepo, optionsRepo, votesRepo) {
        this.configService = configService;
        this.usersRepo = usersRepo;
        this.pollsRepo = pollsRepo;
        this.optionsRepo = optionsRepo;
        this.votesRepo = votesRepo;
    }
    async onModuleInit() {
        if (!this.configService.get('SEED_DB'))
            return;
        await this.seed();
    }
    async seed() {
        const existing = await this.usersRepo.findOne({ where: { username: 'demo' } });
        if (existing) {
            console.log('Database already seeded, skipping.');
            return;
        }
        console.log('Seeding database...');
        // Create demo user
        const passwordHash = await bcrypt.hash('demo1234', 10);
        const user = this.usersRepo.create({
            username: 'demo',
            email: 'demo@teampolls.dev',
            passwordHash,
        });
        const savedUser = await this.usersRepo.save(user);
        const user2 = this.usersRepo.create({
            username: 'alice',
            email: 'alice@teampolls.dev',
            passwordHash,
        });
        const savedUser2 = await this.usersRepo.save(user2);
        // Create polls
        const poll1 = this.pollsRepo.create({
            title: 'What tech stack for the new project?',
            description: 'We need to decide between these frontend frameworks',
            status: 'open',
            createdById: savedUser.id,
        });
        const savedPoll1 = await this.pollsRepo.save(poll1);
        const poll2 = this.pollsRepo.create({
            title: 'Best day for team lunch?',
            description: 'Vote for your preferred day for our monthly team lunch',
            status: 'closed',
            createdById: savedUser.id,
        });
        const savedPoll2 = await this.pollsRepo.save(poll2);
        const poll3 = this.pollsRepo.create({
            title: 'Which conference should we attend?',
            description: null,
            status: 'open',
            isAnonymous: true,
            createdById: savedUser2.id,
        });
        const savedPoll3 = await this.pollsRepo.save(poll3);
        // Create options
        const opts1Data = ['React', 'Vue', 'Svelte', 'Solid.js'];
        const opts1 = await Promise.all(opts1Data.map((text) => {
            const opt = this.optionsRepo.create({ pollId: savedPoll1.id, text });
            return this.optionsRepo.save(opt);
        }));
        const opts2Data = ['Monday', 'Wednesday', 'Friday'];
        const opts2 = await Promise.all(opts2Data.map((text) => {
            const opt = this.optionsRepo.create({ pollId: savedPoll2.id, text });
            return this.optionsRepo.save(opt);
        }));
        const opts3Data = ['React Summit', 'JSConf', 'VueConf', 'Svelte Summit'];
        const opts3 = await Promise.all(opts3Data.map((text) => {
            const opt = this.optionsRepo.create({ pollId: savedPoll3.id, text });
            return this.optionsRepo.save(opt);
        }));
        // Cast some votes
        await Promise.all([
            this.votesRepo.create({ pollId: savedPoll1.id, optionId: opts1[0].id, userId: savedUser.id }),
            this.votesRepo.create({ pollId: savedPoll1.id, optionId: opts1[0].id, userId: savedUser2.id }),
            this.votesRepo.create({ pollId: savedPoll2.id, optionId: opts2[0].id, userId: savedUser.id }),
            this.votesRepo.create({ pollId: savedPoll2.id, optionId: opts2[2].id, userId: savedUser2.id }),
            this.votesRepo.create({ pollId: savedPoll3.id, optionId: opts3[1].id, userId: savedUser.id }),
        ].map((v) => this.votesRepo.save(v)));
        console.log('Seed data created successfully.');
        console.log('  Demo user: demo@teampolls.dev / demo1234');
        console.log('  Second user: alice@teampolls.dev / demo1234');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(poll_entity_1.Poll)),
    __param(3, (0, typeorm_1.InjectRepository)(poll_option_entity_1.PollOption)),
    __param(4, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map