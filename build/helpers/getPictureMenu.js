"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPictureMenu = void 0;
const grammy_1 = require("grammy");
async function getPictureMenu(user) {
    return new grammy_1.InputFile('assets/photos/logo.jpg');
}
exports.getPictureMenu = getPictureMenu;
