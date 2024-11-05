import * as fs from "fs";

interface StickerList {
    [key: string]: string
}
export const stickerList: StickerList = JSON.parse(fs.readFileSync('config/stickers.json', 'utf-8'))

