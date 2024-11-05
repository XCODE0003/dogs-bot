import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as callback} from "@/handlers/support/callback";
import {composer as changeCodeScene} from "@/handlers/support/changeCodeScene";
import {composer as set} from "@/handlers/support/set";

export const composer = new Composer<Context>()
composer.use(callback)
composer.use(changeCodeScene)
composer.use(set)

