"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIBANinfo = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
async function getIBANinfo(IBAN) {
    try {
        const response = await (0, node_fetch_1.default)('https://neutrinoapi.net/bin-lookup?bin-number=' + IBAN, {
            headers: {
                "User-ID": config_1.config.neutrinoApi.userId,
                "API-Key": config_1.config.neutrinoApi.key
            }
        });
        const data = await response.json();
        if (data["card-brand"] === '' || data['api-error'])
            return null;
        return data;
    }
    catch (e) {
        return null;
    }
}
exports.getIBANinfo = getIBANinfo;
