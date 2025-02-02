"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const menu_1 = require("../../handlers/tag/menu");
const visibility_1 = require("../../handlers/tag/visibility");
const changeNameScene_1 = require("../../handlers/tag/changeNameScene");
exports.composer = new grammy_1.Composer();
exports.composer.use(menu_1.composer);
exports.composer.use(visibility_1.composer);
exports.composer.use(changeNameScene_1.composer);
