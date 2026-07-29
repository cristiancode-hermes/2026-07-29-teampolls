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
exports.PollOption = void 0;
const typeorm_1 = require("typeorm");
const poll_entity_1 = require("../polls/poll.entity");
const vote_entity_1 = require("../votes/vote.entity");
let PollOption = class PollOption {
    id;
    pollId;
    poll;
    text;
    votes;
};
exports.PollOption = PollOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PollOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pollId', type: 'integer' }),
    __metadata("design:type", Number)
], PollOption.prototype, "pollId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => poll_entity_1.Poll, (poll) => poll.options),
    (0, typeorm_1.JoinColumn)({ name: 'pollId' }),
    __metadata("design:type", poll_entity_1.Poll)
], PollOption.prototype, "poll", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PollOption.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.option),
    __metadata("design:type", Array)
], PollOption.prototype, "votes", void 0);
exports.PollOption = PollOption = __decorate([
    (0, typeorm_1.Entity)('poll_options')
], PollOption);
//# sourceMappingURL=poll-option.entity.js.map