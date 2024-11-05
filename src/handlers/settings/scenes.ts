import { ScenesComposer } from 'grammy-scenes'

import { Context } from '@/database/models/context'

import { setTetherScene } from './tether/scene'
import { setSupCode } from '../support/scene'

export const settingsScenes = new ScenesComposer<Context>()
settingsScenes.scene(setTetherScene)
settingsScenes.scene(setSupCode)
