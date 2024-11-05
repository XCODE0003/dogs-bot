"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('setTether', handler);
async function handler(ctx) { await ctx.scenes.enter('setTether-scene'); }
