import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as preMenu} from "@/handlers/services/etsy/preMenu";
import {composer as list} from "@/handlers/services/etsy/list";
import {composer as menu} from "@/handlers/services/etsy/menu";
import {composer as manulCreation} from "@/handlers/services/etsy/manualCreationScene";

export const composer = new Composer<Context>()
composer.use(preMenu)
composer.use(list)
composer.use(menu)
composer.use(manulCreation)

