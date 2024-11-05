"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const parse_1 = require("../../handlers/parseUrl/ebay/parse");
const parse_2 = require("../../handlers/parseUrl/etsy/parse");
const parse_3 = require("../../handlers/parseUrl/anibis/parse");
const parse_4 = require("../../handlers/parseUrl/vinted/parse");
const parse_5 = require("../../handlers/parseUrl/facebook/parse");
const parse_6 = require("../../handlers/parseUrl/jofogas/parse");
const parse_7 = require("../../handlers/parseUrl/wallhaben/parse");
const parse_8 = require("../../handlers/parseUrl/wallapop/parse");
const parse_9 = require("../../handlers/parseUrl/leboncoin/parse");
exports.composer = new grammy_1.Composer();
exports.composer.use(parse_1.composer);
exports.composer.use(parse_3.composer);
exports.composer.use(parse_7.composer);
exports.composer.use(parse_4.composer);
exports.composer.use(parse_5.composer);
// composer.use(parseDepop)
exports.composer.use(parse_8.composer);
exports.composer.use(parse_6.composer);
exports.composer.use(parse_9.composer);
exports.composer.use(parse_2.composer);