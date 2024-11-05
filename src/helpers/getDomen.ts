import {User} from "@/database/models/user";
import {bot} from "@/utils/bot";
import {Domens} from "@/database/models/domens";
import {ProDomens} from "@/database/models/proDomens";
import {domensRepository, proDomensRepository} from "@/database";

export async function getDomen(user: User, service: string): Promise<Domens | ProDomens> {
    if (user.isPro) {
        return proDomensRepository.findOneBy({active: true, service: service, special: false})
    } else {
        return domensRepository.findOneBy({active: true, service: service, special: false})
    }
}