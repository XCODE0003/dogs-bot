import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as afkMenu} from "@/handlers/admins/afk/menu";

export const composer = new Composer<Context>()
composer.use(afkMenu)

