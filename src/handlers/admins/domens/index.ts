import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as domenMenu} from "@/handlers/admins/domens/menu";
import {composer as setDomen} from "@/handlers/admins/domens/setDomen";
import {composer as serviceMenu} from "@/handlers/admins/domens/serviceMenu";

export const composer = new Composer<Context>()
composer.use(domenMenu)
composer.use(setDomen)
composer.use(serviceMenu)

