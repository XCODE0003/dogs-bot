import { Composer } from 'grammy'
import { Context } from '@/database/models/context'

import {composer as getMentors} from "@/handlers/mentors/getMentors";
import {composer as setMentor} from "@/handlers/mentors/setMentor";
import {composer as choiceForMentor} from "@/handlers/mentors/choiceForMentor";
import {composer as removeMentor} from "@/handlers/mentors/removeMentor";
import {composer as removeStudents} from "@/handlers/mentors/removeStudents";
import {composer as menu} from "@/handlers/mentors/menu";
import {composer as studentsList} from "@/handlers/mentors/studentsList";

export const composer = new Composer<Context>()

composer.use(getMentors)
composer.use(setMentor)
composer.use(choiceForMentor)
composer.use(removeMentor)
composer.use(menu)
composer.use(studentsList)
composer.use(removeStudents)
