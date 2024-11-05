import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as startStopWork} from "@/handlers/admins/notifications/startStopWork";
import {composer as customNotificationScene} from "@/handlers/admins/notifications/customNotificationScene";

export const composer = new Composer<Context>()
composer.use(startStopWork)
composer.use(customNotificationScene)

