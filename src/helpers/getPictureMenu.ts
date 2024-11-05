import {User} from "@/database/models/user";
import {InputFile} from "grammy";

export async function getPictureMenu(user: User) {
    return new InputFile('assets/photos/logo.jpg')
}
