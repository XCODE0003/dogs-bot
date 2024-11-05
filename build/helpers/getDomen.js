"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomen = void 0;
const database_1 = require("../database");
async function getDomen(user, service) {
    if (user.isPro) {
        return database_1.proDomensRepository.findOneBy({ active: true, service: service, special: false });
    }
    else {
        return database_1.domensRepository.findOneBy({ active: true, service: service, special: false });
    }
}
exports.getDomen = getDomen;
