import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as mentorMenu} from "@/handlers/admins/mentors/menu";
import {composer as infoMentor} from "@/handlers/admins/mentors/infoMentor";
import {composer as addNewMentorScene} from "@/handlers/admins/mentors/addNewMentorScene";
import {composer as changeMentorDesc} from "@/handlers/admins/mentors/methods/changeDescriptionScene";
import {composer as changeProfitCount} from "@/handlers/admins/mentors/methods/changeProfitCountScene";
import {composer as changeMentorPercent} from "@/handlers/admins/mentors/methods/changePercentScene";
import {composer as mentorOffOn} from "@/handlers/admins/mentors/methods/mentorOffOn";
import {composer as mentorList} from "@/handlers/admins/mentors/mentorList";

export const composer = new Composer<Context>()
composer.use(mentorMenu)
composer.use(infoMentor)
composer.use(addNewMentorScene)
composer.use(changeMentorDesc)
composer.use(changeMentorPercent)
composer.use(changeProfitCount)
composer.use(mentorOffOn)
composer.use(mentorList)