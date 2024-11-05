"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const callback_1 = require("../../handlers/support/callback");
const changeCodeScene_1 = require("../../handlers/support/changeCodeScene");
const set_1 = require("../../handlers/support/set");
exports.composer = new grammy_1.Composer();
exports.composer.use(callback_1.composer);
exports.composer.use(changeCodeScene_1.composer);
exports.composer.use(set_1.composer);
