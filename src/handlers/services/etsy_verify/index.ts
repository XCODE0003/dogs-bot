import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as menu} from "@/handlers/services/etsy_verify/menu";
import {composer as manulCreation} from "@/handlers/services/etsy_verify/manualCreationScene";
import {composer as copyAd} from "@/handlers/services/etsy_verify/copyAd";

export const composer = new Composer<Context>()
composer.use(menu)
composer.use(manulCreation)
composer.use(copyAd)

