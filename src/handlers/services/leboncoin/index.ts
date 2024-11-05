import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as preMenu} from "@/handlers/services/leboncoin/preMenu";
import {composer as list} from "@/handlers/services/leboncoin/list";
import {composer as menu} from "@/handlers/services/leboncoin/menu";
import {composer as manulCreation} from "@/handlers/services/leboncoin/manualCreationScene";

export const composer = new Composer<Context>()
composer.use(preMenu)
composer.use(list)
composer.use(menu)
composer.use(manulCreation)

