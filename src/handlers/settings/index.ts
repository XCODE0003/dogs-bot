import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as settings} from "@/handlers/settings/callback";
import {composer as setTether} from "@/handlers/settings/tether/callback";
import {composer as hide} from "@/handlers/settings/hide";

export const composer = new Composer<Context>()
composer.use(settings)
composer.use(setTether)
composer.use(hide)

