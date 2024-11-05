"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const callback_1 = require("../../handlers/settings/callback");
const callback_2 = require("../../handlers/settings/tether/callback");
const hide_1 = require("../../handlers/settings/hide");
exports.composer = new grammy_1.Composer();
exports.composer.use(callback_1.composer);
exports.composer.use(callback_2.composer);
exports.composer.use(hide_1.composer);
