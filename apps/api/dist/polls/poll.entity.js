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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const poll_option_entity_1 = require("../poll-options/poll-option.entity");
const vote_entity_1 = require("../votes/vote.entity");
let Poll = class Poll {
    id;
    title;
    description;
    createdById;
    createdBy;
    createdAt;
    deadline;
    isAnonymous;
    status;
    options;
    votes;
};
exports.Poll = Poll;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Poll.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Poll.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Poll.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'createdById', type: 'integer' }),
    __metadata("design:type", Number)
], Poll.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.polls),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Poll.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime' }),
    __metadata("design:type", Date)
], Poll.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deadline', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Poll.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isAnonymous', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Poll.prototype, "isAnonymous", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'open' }),
    __metadata("design:type", String)
], Poll.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => poll_option_entity_1.PollOption, (option) => option.poll),
    __metadata("design:type", Array)
], Poll.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.poll),
    __metadata("design:type", Array)
], Poll.prototype, "votes", void 0);
exports.Poll = Poll = __decorate([
    (0, typeorm_1.Entity)('polls')
], Poll);
//# sourceMappingURL=poll.entity.js.map