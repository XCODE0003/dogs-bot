import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as setVbiv} from "@/handlers/vbiver/setVbiv";

export const composer = new Composer<Context>()
composer.use(setVbiv)
