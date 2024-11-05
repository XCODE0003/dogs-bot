import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as ebay} from "@/handlers/services/ebay";
import {composer as createLinkEbay} from "@/handlers/services/ebay/createLink";
import {composer as ebayList} from "@/handlers/services/ebay/list";
import {composer as ebayMenu} from "@/handlers/services/ebay/menu";


import {composer as vinted} from "@/handlers/services/vinted/index";
import {composer as facebook} from "@/handlers/services/facebook/index";
import {composer as depop} from "@/handlers/services/depop/index";
import {composer as lebonCoin} from "@/handlers/services/leboncoin/index";
import {composer as etsy} from "@/handlers/services/etsy/index";
import {composer as etsyVerify} from "@/handlers/services/etsy_verify/index";

export const composer = new Composer<Context>()
composer.use(ebay)
composer.use(createLinkEbay)
composer.use(ebayList)
composer.use(ebayMenu)
composer.use(etsyVerify)

composer.use(vinted)
composer.use(facebook)
composer.use(etsy)
composer.use(depop)
composer.use(lebonCoin)
