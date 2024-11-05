"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHandlers = void 0;
const grammy_1 = require("grammy");
const parseUrl_1 = require("./parseUrl");
const menu_1 = require("./menu");
const private_1 = require("./private");
const settings_1 = require("./settings");
const work_1 = require("./work");
const ads_1 = require("./ads");
const services_1 = require("./services");
const logs_1 = require("./logs");
const mentors_1 = require("./mentors");
const admins_1 = require("./admins");
const profiles_1 = require("./profiles");
const tag_1 = require("./tag");
const vbiver_1 = require("./vbiver");
const apply_1 = require("./other/apply");
const verifyNotificationBOT_1 = require("./other/verifyNotificationBOT");
const support_1 = require("../handlers/support");
const chats_1 = require("../handlers/chats");
const scenes_1 = require("../handlers/scenes");
const private_2 = require("../middlewares/private");
const chat_1 = require("../middlewares/chat");
function setupHandlers(bot) {
    try {
        const composer = new grammy_1.Composer();
        composer.callbackQuery('deleteThisMessage', async (ctx) => {
            try {
                await ctx.deleteMessage().catch();
            }
            catch (e) {
                console.log(e);
            }
        });
        composer.use(scenes_1.allScenes.manager());
        composer.use(apply_1.composer);
        composer.use(verifyNotificationBOT_1.composer);
        composer.use(chat_1.chatMiddleware);
        composer.use(chats_1.composer);
        composer.use(private_2.privateMiddleware);
        composer.use(parseUrl_1.composer);
        composer.use(menu_1.composer);
        composer.use(private_1.composer);
        composer.use(work_1.composer);
        composer.use(profiles_1.composer);
        composer.use(services_1.composer);
        composer.use(settings_1.composer);
        composer.use(vbiver_1.composer);
        composer.use(tag_1.composer);
        composer.use(ads_1.composer);
        composer.use(support_1.composer);
        composer.use(logs_1.composer);
        composer.use(mentors_1.composer);
        composer.use(scenes_1.allScenes);
        composer.use(admins_1.composer);
        bot.use(composer);
    }
    catch (e) {
        console.log(e);
    }
}
exports.setupHandlers = setupHandlers;
