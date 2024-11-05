import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as facebook} from "@/handlers/ads/otherSmsEmail/emailFacebook";
import {composer as depop} from "@/handlers/ads/otherSmsEmail/emailDepop";
import {composer as jofogas} from "@/handlers/ads/otherSmsEmail/emailJofogas";
import {composer as smsJofogas} from "@/handlers/ads/otherSmsEmail/smsJofogas";
import {composer as smsPaysend} from "@/handlers/ads/otherSmsEmail/smsPaysend";
import {composer as emailEtsy} from "@/handlers/ads/otherSmsEmail/emailEtsy";

export const composer = new Composer<Context>()
composer.use(facebook)
composer.use(emailEtsy)
composer.use(smsPaysend)
composer.use(depop)
composer.use(jofogas)
composer.use(smsJofogas)
