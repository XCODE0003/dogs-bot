import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as sms} from "@/handlers/admins/mailingList/issue/issueSms";
import {composer as email} from "@/handlers/admins/mailingList/issue/issueEmail";

export const composer = new Composer<Context>()
composer.use(sms)
composer.use(email)
