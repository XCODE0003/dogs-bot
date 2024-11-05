export function getFlagEmoji (countryCode) {
    if (!countryCode) {
        countryCode = 'RU'
    }

    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}