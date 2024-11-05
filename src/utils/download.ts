import arrayBufferToBuffer from 'arraybuffer-to-buffer'
import axios from 'axios'
import {config} from "@/utils/config";

const url = `https://api.telegram.org/file/bot${config.bot.mainToken}/`

export const getPhoto = async (
    filePath: string,
    forceDownload = false
): Promise<Buffer> => {
    const response = await axios.get(url + filePath, { responseType: 'arraybuffer' })
    return arrayBufferToBuffer(response.data)
}
