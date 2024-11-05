import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as preMenu} from "@/handlers/services/depop/preMenu";
import {composer as list} from "@/handlers/services/depop/list";
import {composer as menu} from "@/handlers/services/depop/menu";

export const composer = new Composer<Context>()
composer.use(preMenu)
composer.use(list)
composer.use(menu)

