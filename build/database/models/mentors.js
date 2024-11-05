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
exports.Mentors = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../database/models/user");
let Mentors = class Mentors {
    id;
    user;
    description;
    percent;
    freedom;
    active;
    created_at;
};
exports.Mentors = Mentors;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Mentors.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_1.User)
], Mentors.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "description", type: "text" }),
    __metadata("design:type", String)
], Mentors.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "percent", type: "int" }),
    __metadata("design:type", Number)
], Mentors.prototype, "percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "freedom", type: "int" }),
    __metadata("design:type", Number)
], Mentors.prototype, "freedom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "active", type: "boolean", width: 1, default: true }),
    __metadata("design:type", Boolean)
], Mentors.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Mentors.prototype, "created_at", void 0);
exports.Mentors = Mentors = __decorate([
    (0, typeorm_1.Entity)()
], Mentors);
