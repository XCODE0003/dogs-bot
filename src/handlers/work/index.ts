import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as workMenu} from "@/handlers/work/callbackMenu";
import {composer as country} from "@/handlers/work/country";

export const composer = new Composer<Context>()
composer.use(workMenu)
composer.use(country)

