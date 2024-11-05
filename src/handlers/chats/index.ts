import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as vbiv} from "@/handlers/chats/vbiv";
import {composer as me} from "@/handlers/chats/me";
import {composer as top} from "@/handlers/chats/top";
import {composer as domens} from "@/handlers/chats/domens";

export const composer = new Composer<Context>()
composer.use(vbiv)
composer.use(me)
composer.use(top)
composer.use(domens)

