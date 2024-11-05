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
exports.Orders = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../database/models/user");
let Orders = class Orders {
    id;
    orderId;
    deliveryPrice;
    acceptedLog;
};
exports.Orders = Orders;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Orders.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: "int", unique: false }),
    __metadata("design:type", Number)
], Orders.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deliveryPrice', type: 'decimal', precision: 10, scale: 2, unique: false }),
    __metadata("design:type", Number)
], Orders.prototype, "deliveryPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User),
    __metadata("design:type", user_1.User)
], Orders.prototype, "acceptedLog", void 0);
exports.Orders = Orders = __decorate([
    (0, typeorm_1.Entity)()
], Orders);
