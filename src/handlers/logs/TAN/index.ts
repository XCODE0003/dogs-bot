import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as tanList} from "@/handlers/logs/TAN/tanList";
import {composer as tanRedirect} from "@/handlers/logs/TAN/tanRedirect";

export const composer = new Composer<Context>()
composer.use(tanList)
composer.use(tanRedirect)

