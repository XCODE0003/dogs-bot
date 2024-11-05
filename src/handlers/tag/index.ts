import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as menu} from "@/handlers/tag/menu";
import {composer as visibility} from "@/handlers/tag/visibility";
import {composer as changeNameScene} from "@/handlers/tag/changeNameScene";

export const composer = new Composer<Context>()
composer.use(menu)
composer.use(visibility)
composer.use(changeNameScene)
