"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameListForAdmin = exports.Usernames = void 0;
const fs = __importStar(require("fs"));
class Usernames {
    constructor() { }
    async getList() {
        try {
            return JSON.parse(fs.readFileSync('config/usernameList.json', 'utf-8'));
        }
        catch (e) {
            return undefined;
        }
    }
    async updateList(data) {
        try {
            await fs.writeFileSync('config/usernameList.json', data);
            return true;
        }
        catch (e) {
            // Handle the error appropriately, e.g., log it or throw it.
            return false;
        }
    }
    async getUsernameById(username) {
        const list = await this.getList();
        if (!list)
            return undefined;
        return list.find((obj) => obj.username.toLowerCase() === username.toLowerCase());
    }
    async checkUsername(username, telegramId) {
        const list = await this.getList();
        if (!list)
            return false;
        const existingUser = list.find((obj) => obj.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            if (telegramId !== existingUser.telegramId) {
                existingUser.username = username;
            }
            else {
                return true;
            }
        }
        else {
            list.push({
                username,
                telegramId
            });
        }
        return await this.updateList(JSON.stringify(list));
    }
}
exports.Usernames = Usernames;
exports.UsernameListForAdmin = new Usernames();
