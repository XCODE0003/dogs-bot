import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as preMenu} from "@/handlers/services/facebook/preMenu";
import {composer as list} from "@/handlers/services/facebook/list";
import {composer as menu} from "@/handlers/services/facebook/menu";

export const composer = new Composer<Context>()
composer.use(preMenu)
composer.use(list)
composer.use(menu)

