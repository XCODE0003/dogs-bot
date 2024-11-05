"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const callbackMenu_1 = require("../../handlers/work/callbackMenu");
const country_1 = require("../../handlers/work/country");
exports.composer = new grammy_1.Composer();
exports.composer.use(callbackMenu_1.composer);
exports.composer.use(country_1.composer);
