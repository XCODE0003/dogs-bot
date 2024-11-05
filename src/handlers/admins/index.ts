import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as changeProfitStatus} from "@/handlers/admins/changeProfitStatus";
import {composer as menu} from "@/handlers/admins/menu";
import {composer as adminMentors} from "@/handlers/admins/mentors";
import {composer as notifications} from "@/handlers/admins/notifications";
// import {composer as adminSupports} from "@/handlers/admins/supports";
import {composer as vbivers} from "@/handlers/admins/vbivers";
import {composer as setRole} from "@/handlers/admins/setRole";
import {composer as userInfo} from "@/handlers/admins/userInfo";
import {composer as domens} from "@/handlers/admins/domens";
import {composer as proDomens} from "@/handlers/admins/proDomens";
import {composer as acceptingUser} from "@/handlers/admins/acceptingUser";
import {composer as banUnBan} from "@/handlers/admins/banUnBan";
import {composer as afk} from "@/handlers/admins/afk";
import {composer as kick} from "@/handlers/admins/kick";
import {composer as getId} from "@/handlers/admins/getId";
import {composer as who} from "@/handlers/admins/who";
import {composer as proStatus} from "@/handlers/admins/proStatus";
import {composer as changeDomen} from "@/handlers/admins/changeDomen";
import {adminMiddleware} from "@/middlewares/admin";

export const composer = new Composer<Context>()
composer.use(adminMiddleware)
composer.use(acceptingUser)

composer.use(changeProfitStatus)
composer.use(banUnBan)
composer.use(kick)
composer.use(menu)
composer.use(adminMentors)
// composer.use(adminSupports)
composer.use(notifications)
composer.use(vbivers)
composer.use(setRole)
composer.use(userInfo)
composer.use(domens)
composer.use(getId)
composer.use(who)
composer.use(proStatus)
composer.use(proDomens)
composer.use(changeDomen)
composer.use(afk)

