import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as parseEbay} from "@/handlers/parseUrl/ebay/parse";
import {composer as parseEtsy} from "@/handlers/parseUrl/etsy/parse";
import {composer as parseAnibis} from "@/handlers/parseUrl/anibis/parse";
import {composer as parseVinted} from "@/handlers/parseUrl/vinted/parse";
import {composer as parseFacebook} from "@/handlers/parseUrl/facebook/parse";
import {composer as parseDepop} from "@/handlers/parseUrl/depop/parse";
import {composer as jofogas} from "@/handlers/parseUrl/jofogas/parse";
import {composer as parseWallhaben} from "@/handlers/parseUrl/wallhaben/parse";
import {composer as parseWallpop} from "@/handlers/parseUrl/wallapop/parse";
import {composer as parseLebonCoin} from "@/handlers/parseUrl/leboncoin/parse";

export const composer = new Composer<Context>()
composer.use(parseEbay)
composer.use(parseAnibis)
composer.use(parseWallhaben)
composer.use(parseVinted)
composer.use(parseFacebook)
// composer.use(parseDepop)
composer.use(parseWallpop)
composer.use(jofogas)
composer.use(parseLebonCoin)
composer.use(parseEtsy)
