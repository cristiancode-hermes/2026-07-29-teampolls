"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollOptionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const poll_option_entity_1 = require("./poll-option.entity");
const poll_options_service_1 = require("./poll-options.service");
let PollOptionsModule = class PollOptionsModule {
};
exports.PollOptionsModule = PollOptionsModule;
exports.PollOptionsModule = PollOptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([poll_option_entity_1.PollOption])],
        providers: [poll_options_service_1.PollOptionsService],
        exports: [poll_options_service_1.PollOptionsService],
    })
], PollOptionsModule);
//# sourceMappingURL=poll-options.module.js.map