import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as start} from "@/handlers/menu/command";
import {composer as useful} from "@/handlers/menu/useful";
import {composer as rules} from "@/handlers/menu/rules";
import {composer as communication} from "@/handlers/menu/communication";
import {composer as chatList} from "@/handlers/menu/chatList";
import {composer as proStatus} from "@/handlers/menu/proStatus";

export const composer = new Composer<Context>()
composer.use(start)
composer.use(useful)
composer.use(rules)
composer.use(communication)
composer.use(chatList)
composer.use(proStatus)
