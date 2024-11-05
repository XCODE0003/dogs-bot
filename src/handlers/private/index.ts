import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as menu} from "@/handlers/private/menu";
import {composer as lonelypups} from "@/handlers/private/lonelypups";
import {composer as paysend} from "@/handlers/private/paysend/menu";

export const composer = new Composer<Context>()
composer.use(menu)
composer.use(lonelypups)
composer.use(paysend)

