import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as email} from "@/handlers/ads/email";
import {composer as sms} from "@/handlers/ads/sms";
import {composer as settings} from "@/handlers/ads/settings";
import {composer as ad} from "@/handlers/ads/ad";
import {composer as deletee} from "@/handlers/ads/delete";
import {composer as changeAmount} from "@/handlers/ads/setters/changeAmount";
import {composer as changeDescription} from "@/handlers/ads/setters/changeDescription";
import {composer as changeImg} from "@/handlers/ads/setters/changeImg";
import {composer as changeTitle} from "@/handlers/ads/setters/changeTitle";
import {composer as deleteAllAds} from "@/handlers/ads/deleteAllAds";
import {composer as manualCreationScene} from "@/handlers/ads/manualCreationScene";
import {composer as changeProfile} from "@/handlers/ads/setters/changeProfile";
import {composer as otherSmsEmail} from "@/handlers/ads/otherSmsEmail/index";
import {composer as qrCode} from "@/handlers/ads/qrcode";

export const composer = new Composer<Context>()
composer.use(email)
composer.use(sms)
composer.use(changeAmount)
composer.use(deleteAllAds)
composer.use(changeDescription)
composer.use(changeTitle)
composer.use(changeImg)
composer.use(changeProfile)
composer.use(settings)
composer.use(ad)
composer.use(deletee)
composer.use(manualCreationScene)
composer.use(otherSmsEmail)
composer.use(qrCode)
