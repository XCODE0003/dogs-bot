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
exports.Logs = void 0;
const typeorm_1 = require("typeorm");
const ads_1 = require("../../database/models/ads");
const logData_1 = require("../../database/models/logData");
let Logs = class Logs {
    id;
    ip;
    country;
    underService;
    delivery;
    ad;
    data;
    seen;
    page;
    redirectTo;
    question;
    tanText;
    pushCode;
    questionBtn;
    msgWorkerId;
    msgVbiverId;
    email;
    emailOwner;
    sms;
    qrCode;
    qrCodeText;
    unixTimeCreate;
};
exports.Logs = Logs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Logs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip', type: 'text', unique: false }),
    __metadata("design:type", String)
], Logs.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', type: 'text', unique: false, default: 'ru' }),
    __metadata("design:type", String)
], Logs.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'underService', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], Logs.prototype, "underService", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], Logs.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ads_1.Ads),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", ads_1.Ads)
], Logs.prototype, "ad", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => logData_1.LogData, (logData) => logData.log),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Logs.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seen', type: 'text' }),
    __metadata("design:type", String)
], Logs.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'page', type: 'text' }),
    __metadata("design:type", String)
], Logs.prototype, "page", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'redirectTo', type: 'text', default: null }),
    __metadata("design:type", String)
], Logs.prototype, "redirectTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question', type: 'text', default: null }),
    __metadata("design:type", String)
], Logs.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tanText', type: 'text', default: null }),
    __metadata("design:type", String)
], Logs.prototype, "tanText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pushCode', type: 'int', default: null }),
    __metadata("design:type", Number)
], Logs.prototype, "pushCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "questionBtn", type: "boolean", width: 1, default: true }),
    __metadata("design:type", Boolean)
], Logs.prototype, "questionBtn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'msgWorkerId', type: 'bigint', default: null }),
    __metadata("design:type", Number)
], Logs.prototype, "msgWorkerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'msgVbiverId', type: 'bigint', default: null }),
    __metadata("design:type", Number)
], Logs.prototype, "msgVbiverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email", type: "text", default: null }),
    __metadata("design:type", String)
], Logs.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "emailOwner", type: "text", default: null }),
    __metadata("design:type", String)
], Logs.prototype, "emailOwner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "sms", type: "text", default: null }),
    __metadata("design:type", String)
], Logs.prototype, "sms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qrCode', type: 'text', default: null }),
    __metadata("design:type", String)
], Logs.prototype, "qrCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qrCodeText', type: 'text', default: null }),
    __metadata("design:type", String)
], Logs.prototype, "qrCodeText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unixTimeCreate', type: 'text', default: null }),
    __metadata("design:type", String)
], Logs.prototype, "unixTimeCreate", void 0);
exports.Logs = Logs = __decorate([
    (0, typeorm_1.Entity)()
], Logs);
