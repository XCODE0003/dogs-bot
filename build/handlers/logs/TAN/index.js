"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const tanList_1 = require("../../../handlers/logs/TAN/tanList");
const tanRedirect_1 = require("../../../handlers/logs/TAN/tanRedirect");
exports.composer = new grammy_1.Composer();
exports.composer.use(tanList_1.composer);
exports.composer.use(tanRedirect_1.composer);
