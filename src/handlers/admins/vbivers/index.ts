import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as menu} from "@/handlers/admins/vbivers/menu";
import {composer as info} from "@/handlers/admins/vbivers/info";
import {composer as vbiverList} from "@/handlers/admins/vbivers/vbiverList";

export const composer = new Composer<Context>()
composer.use(menu)
composer.use(info)
composer.use(vbiverList)
