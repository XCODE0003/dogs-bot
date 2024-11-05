import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as mailingMenu} from "@/handlers/admins/mailingList/menu";
import {composer as issue} from "@/handlers/admins/mailingList/issue";
import {composer as info} from "@/handlers/admins/mailingList/info";

export const composer = new Composer<Context>()
composer.use(mailingMenu)
composer.use(issue)
composer.use(info)
