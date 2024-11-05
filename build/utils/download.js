"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoto = void 0;
const arraybuffer_to_buffer_1 = __importDefault(require("arraybuffer-to-buffer"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const url = `https://api.telegram.org/file/bot${config_1.config.bot.mainToken}/`;
const getPhoto = async (filePath, forceDownload = false) => {
    const response = await axios_1.default.get(url + filePath, { responseType: 'arraybuffer' });
    return (0, arraybuffer_to_buffer_1.default)(response.data);
};
exports.getPhoto = getPhoto;
