import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as menu} from "@/handlers/private/lonelypups/menu";
import {composer as t2} from "@/handlers/private/lonelypups/setNewEmailForLonelypups";
import {composer as setAmount} from "@/handlers/private/lonelypups/setAmountDelivery";
import {composer as sendEmail} from "@/handlers/private/lonelypups/sendEmail";
import {composer as userEmails} from "@/handlers/private/lonelypups/userEmails";
import {composer as emailInfo} from "@/handlers/private/lonelypups/emailInfo";
import {composer as delete2 } from "@/handlers/private/lonelypups/delete";
import {composer as CreatePayment } from "@/handlers/private/lonelypups/createPayment";

export const composer = new Composer<Context>()
composer.use(menu)
composer.use(setAmount)
composer.use(sendEmail)
composer.use(userEmails)
composer.use(emailInfo)
composer.use(delete2)
composer.use(t2)
composer.use(CreatePayment)

