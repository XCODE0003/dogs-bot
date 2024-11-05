"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsScenes = void 0;
const grammy_scenes_1 = require("grammy-scenes");
const scene_1 = require("./tether/scene");
const scene_2 = require("../support/scene");
exports.settingsScenes = new grammy_scenes_1.ScenesComposer();
exports.settingsScenes.scene(scene_1.setTetherScene);
exports.settingsScenes.scene(scene_2.setSupCode);
