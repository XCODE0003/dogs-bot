"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlagEmoji = void 0;
function getFlagEmoji(countryCode) {
    if (!countryCode) {
        countryCode = 'RU';
    }
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}
exports.getFlagEmoji = getFlagEmoji;
