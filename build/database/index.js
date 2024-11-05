"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDataRepository = exports.ordersRepository = exports.lonelypupsRepository = exports.supportsRepository = exports.profilesRepository = exports.mentorsRepository = exports.settingsRepository = exports.logsRepository = exports.proDomensRepository = exports.domensRepository = exports.profitRepository = exports.adsRepository = exports.userRepository = exports.dataSourceDatabase = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../database/models/user");
const config_1 = require("../utils/config");
const ads_1 = require("../database/models/ads");
const profit_1 = require("../database/models/profit");
const domens_1 = require("../database/models/domens");
const proDomens_1 = require("../database/models/proDomens");
const logs_1 = require("../database/models/logs");
const settings_1 = require("../database/models/settings");
const mentors_1 = require("../database/models/mentors");
const profiles_1 = require("../database/models/profiles");
const supports_1 = require("../database/models/supports");
const logData_1 = require("../database/models/logData");
const lonelypups_1 = require("../database/models/lonelypups");
const orders_1 = require("../database/models/orders");
const options = config_1.config.database;
exports.dataSourceDatabase = new typeorm_1.DataSource({
    ...options,
    entities: [user_1.User, ads_1.Ads, profit_1.Profit, orders_1.Orders, domens_1.Domens, logs_1.Logs, logData_1.LogData, settings_1.Settings, mentors_1.Mentors, profiles_1.Profiles, supports_1.Supports, proDomens_1.ProDomens, lonelypups_1.Lonelypups],
});
exports.userRepository = exports.dataSourceDatabase.getRepository(user_1.User);
exports.adsRepository = exports.dataSourceDatabase.getRepository(ads_1.Ads);
exports.profitRepository = exports.dataSourceDatabase.getRepository(profit_1.Profit);
exports.domensRepository = exports.dataSourceDatabase.getRepository(domens_1.Domens);
exports.proDomensRepository = exports.dataSourceDatabase.getRepository(proDomens_1.ProDomens);
exports.logsRepository = exports.dataSourceDatabase.getRepository(logs_1.Logs);
exports.settingsRepository = exports.dataSourceDatabase.getRepository(settings_1.Settings);
exports.mentorsRepository = exports.dataSourceDatabase.getRepository(mentors_1.Mentors);
exports.profilesRepository = exports.dataSourceDatabase.getRepository(profiles_1.Profiles);
exports.supportsRepository = exports.dataSourceDatabase.getRepository(supports_1.Supports);
exports.lonelypupsRepository = exports.dataSourceDatabase.getRepository(lonelypups_1.Lonelypups);
exports.ordersRepository = exports.dataSourceDatabase.getRepository(orders_1.Orders);
exports.logDataRepository = exports.dataSourceDatabase.getRepository(logData_1.LogData);
