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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const ads_1 = require("../../database/models/ads");
const mentors_1 = require("../../database/models/mentors");
const profit_1 = require("../../database/models/profit");
const profiles_1 = require("../../database/models/profiles");
var UserRole;
(function (UserRole) {
    UserRole["RANDOM"] = "random";
    UserRole["CONSIDERATION"] = "consideration";
    UserRole["NOTACCEPT"] = "notAccept";
    UserRole["WORKER"] = "worker";
    UserRole["VBIVER"] = "vbiver";
    UserRole["BAN"] = "ban";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    id;
    tgId;
    isPro;
    tag;
    visibilityTag;
    hideUsername;
    admin;
    naVbive;
    private;
    trcAddress;
    firstName;
    supportCode;
    photoMenu;
    supportTeam;
    sms;
    email;
    mentor;
    profiles;
    role;
    logs;
    ads;
    lastProfit;
    created;
    vbivDate;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tgId', type: 'bigint', unique: true }),
    __metadata("design:type", Number)
], User.prototype, "tgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isPro', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isPro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tag', type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visibilityTag', type: 'bool', width: 1, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "visibilityTag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hideUsername', type: 'bool', width: 1, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hideUsername", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin', type: 'bool', width: 1, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'naVbive', type: 'bool', width: 1, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "naVbive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'private', type: 'bool', width: 1, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "private", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trcAddress', type: 'text', default: null }),
    __metadata("design:type", String)
], User.prototype, "trcAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'firstName', type: 'text', default: null }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supportCode', type: 'text', default: null }),
    __metadata("design:type", String)
], User.prototype, "supportCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'photoMenu', type: 'text', default: null }),
    __metadata("design:type", String)
], User.prototype, "photoMenu", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supportTeam', type: 'int', default: 0 }),
    __metadata("design:type", Boolean)
], User.prototype, "supportTeam", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mentors_1.Mentors),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", mentors_1.Mentors)
], User.prototype, "mentor", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => profiles_1.Profiles, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], User.prototype, "profiles", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.RANDOM }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ads_1.Ads, (ads) => ads.acceptedLog),
    __metadata("design:type", Array)
], User.prototype, "logs", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ads_1.Ads, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "ads", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profit_1.Profit),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", profit_1.Profit)
], User.prototype, "lastProfit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created', type: 'datetime', default: null }),
    __metadata("design:type", String)
], User.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vbivDate', type: 'datetime', default: null }),
    __metadata("design:type", String)
], User.prototype, "vbivDate", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
