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
exports.Vote = void 0;
const typeorm_1 = require("typeorm");
const poll_entity_1 = require("../polls/poll.entity");
const poll_option_entity_1 = require("../poll-options/poll-option.entity");
const user_entity_1 = require("../users/user.entity");
let Vote = class Vote {
    id;
    pollId;
    poll;
    optionId;
    option;
    userId;
    user;
    createdAt;
};
exports.Vote = Vote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Vote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pollId', type: 'integer' }),
    __metadata("design:type", Number)
], Vote.prototype, "pollId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => poll_entity_1.Poll, (poll) => poll.votes),
    (0, typeorm_1.JoinColumn)({ name: 'pollId' }),
    __metadata("design:type", poll_entity_1.Poll)
], Vote.prototype, "poll", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'optionId', type: 'integer' }),
    __metadata("design:type", Number)
], Vote.prototype, "optionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => poll_option_entity_1.PollOption, (option) => option.votes),
    (0, typeorm_1.JoinColumn)({ name: 'optionId' }),
    __metadata("design:type", poll_option_entity_1.PollOption)
], Vote.prototype, "option", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userId', type: 'integer' }),
    __metadata("design:type", Number)
], Vote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Vote.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime' }),
    __metadata("design:type", Date)
], Vote.prototype, "createdAt", void 0);
exports.Vote = Vote = __decorate([
    (0, typeorm_1.Entity)('votes'),
    (0, typeorm_1.Unique)(['pollId', 'userId'])
], Vote);
//# sourceMappingURL=vote.entity.js.map