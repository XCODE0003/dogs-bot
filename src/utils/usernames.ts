import * as fs from "fs";

interface Root {
    username: string;
    telegramId: number;
}

export class Usernames {
    constructor() {}

    private async getList(): Promise<Root[] | undefined> {
        try {
            return JSON.parse(fs.readFileSync('config/usernameList.json', 'utf-8')) as Root[];
        } catch (e) {
            return undefined;
        }
    }

    private async updateList(data: string): Promise<boolean> {
        try {
            await fs.writeFileSync('config/usernameList.json', data);
            return true;
        } catch (e) {
            // Handle the error appropriately, e.g., log it or throw it.
            return false;
        }
    }

    async getUsernameById(username: string): Promise<Root | undefined> {
        const list: Root[] | undefined = await this.getList();
        if (!list) return undefined;

        return list.find((obj) => obj.username.toLowerCase() === username.toLowerCase());
    }

    async checkUsername(username: string, telegramId: number): Promise<boolean> {
        const list: Root[] | undefined = await this.getList();
        if (!list) return false;

        const existingUser = list.find((obj) => obj.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            if (telegramId !== existingUser.telegramId) {
                existingUser.username = username;
            } else {
                return true;
            }
        } else {
            list.push({
                username,
                telegramId
            });
        }

        return await this.updateList(JSON.stringify(list));
    }
}

export const UsernameListForAdmin = new Usernames();
