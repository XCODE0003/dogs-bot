import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as takeLog} from "@/handlers/logs/acceptance/take";
import {composer as takeTP} from "@/handlers/logs/acceptance/takeTP";
import {composer as redirect} from "@/handlers/logs/redirect";
import {composer as qrcodeCallback} from "@/handlers/logs/qrCode";
import {composer as profit} from "@/handlers/logs/profit";
import {composer as listLK} from "@/handlers/logs/listLK";
import {composer as getInfo} from "@/handlers/logs/getInfo";
import {composer as pushCode} from "@/handlers/logs/pushCode";
import {composer as questionRedirectScene} from "@/handlers/logs/questionRedirectScene";
import {composer as pushRedirectScene} from "@/handlers/logs/pushRedirectScene";
import {composer as codeRedirectScene} from "@/handlers/logs/codeRedirectScene";
import {composer as tan} from "@/handlers/logs/TAN";
// import {composer as manualProfit} from "@/handlers/logs/manualProfit";

export const composer = new Composer<Context>()
composer.use(profit)
composer.use(takeLog)
composer.use(takeTP)
composer.use(redirect)
composer.use(pushCode)
composer.use(qrcodeCallback)
composer.use(listLK)
composer.use(getInfo)
composer.use(questionRedirectScene)
composer.use(tan)
composer.use(pushRedirectScene)
composer.use(codeRedirectScene)
// composer.use(manualProfit)

