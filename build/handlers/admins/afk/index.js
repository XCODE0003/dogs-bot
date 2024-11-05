"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const menu_1 = require("../../../handlers/admins/afk/menu");
exports.composer = new grammy_1.Composer();
exports.composer.use(menu_1.composer);
