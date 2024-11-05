import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as domenMenu} from "@/handlers/admins/proDomens/menu";
import {composer as setDomen} from "@/handlers/admins/proDomens/setDomen";
import {composer as serviceMenu} from "@/handlers/admins/proDomens/serviceMenu";

export const composer = new Composer<Context>()
composer.use(domenMenu)
composer.use(setDomen)
composer.use(serviceMenu)

