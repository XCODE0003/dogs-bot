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
exports.Profit = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../database/models/user");
const mentors_1 = require("../../database/models/mentors");
let Profit = class Profit {
    id;
    isPaid;
    worker;
    zagnobil;
    vbiver;
    mentor;
    support;
    value;
    workerValue;
    supportValue;
    mentorValue;
    msgId;
    created_at;
};
exports.Profit = Profit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Profit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "isPaid", type: "bool", width: 1, default: false }),
    __metadata("design:type", Boolean)
], Profit.prototype, "isPaid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_1.User)
], Profit.prototype, "worker", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "zagnobil", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], Profit.prototype, "zagnobil", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_1.User)
], Profit.prototype, "vbiver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mentors_1.Mentors),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", mentors_1.Mentors)
], Profit.prototype, "mentor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_1.User)
], Profit.prototype, "support", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Profit.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'workerValue', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Profit.prototype, "workerValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vbiverValue', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Profit.prototype, "supportValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mentorValue', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Profit.prototype, "mentorValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'msgId', type: 'bigint' }),
    __metadata("design:type", Number)
], Profit.prototype, "msgId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Profit.prototype, "created_at", void 0);
exports.Profit = Profit = __decorate([
    (0, typeorm_1.Entity)()
], Profit);
