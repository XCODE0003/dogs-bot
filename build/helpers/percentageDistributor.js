"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentageDistributor = void 0;
async function percentageDistributor(value, percent) {
    let statePercent = undefined;
    const percentLength = percent.toString().length;
    if (percentLength === 1) {
        statePercent = Number(`0.0${percent}`);
    }
    else if (percentLength === 2) {
        statePercent = Number(`0.${percent}`);
    }
    return Math.round(value * statePercent);
}
exports.percentageDistributor = percentageDistributor;
