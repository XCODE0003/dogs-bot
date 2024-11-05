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
exports.Profiles = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../database/models/user");
let Profiles = class Profiles {
    id;
    fullName;
    phone;
    service;
    country;
    delivery;
    avatar;
    user;
};
exports.Profiles = Profiles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Profiles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fullName', type: 'text', nullable: false }),
    __metadata("design:type", String)
], Profiles.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'text', nullable: false }),
    __metadata("design:type", String)
], Profiles.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service', type: 'text', nullable: false }),
    __metadata("design:type", String)
], Profiles.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', type: 'text', nullable: false }),
    __metadata("design:type", String)
], Profiles.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery', type: 'text', nullable: false }),
    __metadata("design:type", String)
], Profiles.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Profiles.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_1.User)
], Profiles.prototype, "user", void 0);
exports.Profiles = Profiles = __decorate([
    (0, typeorm_1.Entity)()
], Profiles);
