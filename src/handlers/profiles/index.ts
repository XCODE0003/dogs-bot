import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as menu} from "@/handlers/profiles/menu";
import {composer as create} from "@/handlers/profiles/create";
import {composer as list} from "@/handlers/profiles/list";
import {composer as profileInfo} from "@/handlers/profiles/profileInfo";
import {composer as setData} from "@/handlers/profiles/setData";
import {composer as deleteProfile} from "@/handlers/profiles/delete";

export const composer = new Composer<Context>()
composer.use(menu)
composer.use(create)
composer.use(list)
composer.use(profileInfo)
composer.use(setData)
composer.use(deleteProfile)

