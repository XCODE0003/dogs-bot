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
exports.Ads = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../database/models/user");
const logs_1 = require("../../database/models/logs");
const profiles_1 = require("../../database/models/profiles");
let Ads = class Ads {
    id;
    title;
    sender;
    seller;
    email;
    phone;
    service;
    description;
    country;
    price;
    deliveryPrice;
    link;
    originallink;
    date;
    img;
    profits;
    views;
    page;
    underService;
    support;
    acceptedLog;
    pageMobile;
    author;
    profile;
    sendNotif;
    delete;
    manualCreation;
    log;
    created;
};
exports.Ads = Ads;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ads.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'text' }),
    __metadata("design:type", String)
], Ads.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "sender", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], Ads.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller', type: 'text', default: '{}' }),
    __metadata("design:type", String)
], Ads.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'text', default: null }),
    __metadata("design:type", String)
], Ads.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'text', default: null }),
    __metadata("design:type", String)
], Ads.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service', type: 'text', default: 'ebay' }),
    __metadata("design:type", String)
], Ads.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text' }),
    __metadata("design:type", String)
], Ads.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', type: 'text' }),
    __metadata("design:type", String)
], Ads.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price', type: 'text' }),
    __metadata("design:type", String)
], Ads.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deliveryPrice', type: 'text', default: null }),
    __metadata("design:type", String)
], Ads.prototype, "deliveryPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'link', type: 'text' }),
    __metadata("design:type", String)
], Ads.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'originallink', type: 'text' }),
    __metadata("design:type", String)
], Ads.prototype, "originallink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'varchar', unique: true }),
    __metadata("design:type", String)
], Ads.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'img', type: 'text' }),
    __metadata("design:type", String)
], Ads.prototype, "img", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profits', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Ads.prototype, "profits", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'views', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Ads.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'page', type: 'longtext', default: 0 }),
    __metadata("design:type", String)
], Ads.prototype, "page", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'underService', type: 'text', unique: false, default: null }),
    __metadata("design:type", String)
], Ads.prototype, "underService", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User),
    __metadata("design:type", user_1.User)
], Ads.prototype, "support", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.logs),
    __metadata("design:type", user_1.User)
], Ads.prototype, "acceptedLog", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pageMobile', type: 'longtext', default: 0 }),
    __metadata("design:type", String)
], Ads.prototype, "pageMobile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.ads, { onDelete: "CASCADE" }),
    __metadata("design:type", user_1.User)
], Ads.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profiles_1.Profiles, (profile) => profile.id),
    __metadata("design:type", profiles_1.Profiles)
], Ads.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "sendNotif", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], Ads.prototype, "sendNotif", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "delete", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], Ads.prototype, "delete", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "manualCreation", type: "boolean", width: 1, default: false }),
    __metadata("design:type", Boolean)
], Ads.prototype, "manualCreation", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => logs_1.Logs),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", logs_1.Logs)
], Ads.prototype, "log", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created', type: 'datetime', default: null }),
    __metadata("design:type", String)
], Ads.prototype, "created", void 0);
exports.Ads = Ads = __decorate([
    (0, typeorm_1.Entity)()
], Ads);
