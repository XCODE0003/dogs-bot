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
exports.Settings = void 0;
const typeorm_1 = require("typeorm");
let Settings = class Settings {
    id;
    percent;
    proPercent;
    supportPercent;
    work;
};
exports.Settings = Settings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Settings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'percent', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Settings.prototype, "percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'proPercent', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Settings.prototype, "proPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supportPercent', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Settings.prototype, "supportPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "work", type: "boolean", width: 1, default: true }),
    __metadata("design:type", Boolean)
], Settings.prototype, "work", void 0);
exports.Settings = Settings = __decorate([
    (0, typeorm_1.Entity)()
], Settings);
