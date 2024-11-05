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
exports.ProDomens = void 0;
const typeorm_1 = require("typeorm");
let ProDomens = class ProDomens {
    id;
    active;
    wasUsed;
    service;
    country;
    link;
    dateChange;
    special;
};
exports.ProDomens = ProDomens;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProDomens.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "active", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], ProDomens.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "wasUsed", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], ProDomens.prototype, "wasUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service', type: 'text', unique: false }),
    __metadata("design:type", String)
], ProDomens.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', type: 'text', unique: false }),
    __metadata("design:type", String)
], ProDomens.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'link', type: 'text' }),
    __metadata("design:type", String)
], ProDomens.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dateChange', type: 'datetime' }),
    __metadata("design:type", String)
], ProDomens.prototype, "dateChange", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "special", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], ProDomens.prototype, "special", void 0);
exports.ProDomens = ProDomens = __decorate([
    (0, typeorm_1.Entity)()
], ProDomens);
