"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const startStopWork_1 = require("../../../handlers/admins/notifications/startStopWork");
const customNotificationScene_1 = require("../../../handlers/admins/notifications/customNotificationScene");
exports.composer = new grammy_1.Composer();
exports.composer.use(startStopWork_1.composer);
exports.composer.use(customNotificationScene_1.composer);
