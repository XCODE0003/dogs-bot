"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const setVbiv_1 = require("../../handlers/vbiver/setVbiv");
exports.composer = new grammy_1.Composer();
exports.composer.use(setVbiv_1.composer);
