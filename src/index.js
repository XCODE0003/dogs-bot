"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var runner_1 = require("@grammyjs/runner");
var beforeStart_1 = require("./utils/beforeStart");
var bot_1 = require("./utils/bot");
var setupSession_1 = require("@/utils/setupSession");
var database_1 = require("@/database");
var getUsername_1 = require("@/helpers/getUsername");
var moment_1 = require("moment/moment");
var fs_1 = require("fs");
var console = require("console");
var config_1 = require("@/utils/config");
var user_1 = require("@/database/models/user");
var mysql = require('mysql2');
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function getTop() {
            return __awaiter(this, void 0, void 0, function () {
                var data, profits, _loop_1, _i, profits_1, profit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = { allCash: 0, users: [] };
                            return [4 /*yield*/, database_1.profitRepository.find({
                                    relations: ['worker']
                                })];
                        case 1:
                            profits = _a.sent();
                            _loop_1 = function (profit) {
                                var userIndex = data.users.findIndex(function (item) { return item.userId === profit.worker.tgId; });
                                var user = data.users[userIndex];
                                if (userIndex === -1) {
                                    user = { allDays: 0, today: 0, twoWeaksAgo: 0, userId: profit.worker.tgId, yesterday: 0 };
                                }
                                var profitDate = (0, moment_1["default"])(profit.created_at);
                                var nowDate = (0, moment_1["default"])(Date.now());
                                if (profitDate.format('YY MM DD') === nowDate.format('YY MM DD')) {
                                    user.today += profit.workerValue;
                                }
                                if (profitDate.format('YY MM DD') === nowDate.subtract(1, 'day').format('YY MM DD')) {
                                    user.yesterday += profit.workerValue;
                                }
                                var minutes = (Date.now() - Date.parse(String(profitDate))) / 86400000; //86400000 - ms в дне
                                minutes = Math.round(minutes);
                                if (minutes < 13) {
                                    user.twoWeaksAgo += profit.workerValue;
                                }
                                user.allDays += profit.workerValue;
                                data.allCash += profit.value;
                                if (userIndex === -1) {
                                    data.users.push(user);
                                }
                                else {
                                    data.users[userIndex] = user;
                                }
                            };
                            for (_i = 0, profits_1 = profits; _i < profits_1.length; _i++) {
                                profit = profits_1[_i];
                                _loop_1(profit);
                            }
                            return [2 /*return*/, data];
                    }
                });
            });
        }
        function addUsernames(data) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _i, i, user, userInDatabase, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = [];
                            for (_b in data.users)
                                _a.push(_b);
                            _i = 0;
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            i = _a[_i];
                            user = data.users[i];
                            return [4 /*yield*/, database_1.userRepository.findOne({
                                    where: {
                                        tgId: user.userId
                                    }
                                })];
                        case 2:
                            userInDatabase = _d.sent();
                            _c = user;
                            return [4 /*yield*/, (0, getUsername_1.getUsername)(userInDatabase)];
                        case 3:
                            _c.username = _d.sent();
                            data.users[i] = user;
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                        case 4:
                            _d.sent();
                            _d.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, data];
                    }
                });
            });
        }
        function updateTime(data, time) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            data.users.sort(function (a, b) { return a[time] - b[time]; });
                            data.users = data.users.slice(data.users.length - 10, data.users.length);
                            _b = (_a = setupSession_1.redis).set;
                            _c = ["top-".concat(time)];
                            _e = (_d = JSON).stringify;
                            return [4 /*yield*/, addUsernames(data)];
                        case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_e.apply(_d, [_f.sent()])]))];
                        case 2:
                            _f.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function updateTop(update) {
            return __awaiter(this, void 0, void 0, function () {
                var list;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            list = undefined;
                            try {
                                // @ts-ignore
                                list = JSON.parse(fs_1["default"].readFileSync('assets/usersTop.json', 'utf-8'));
                            }
                            catch (e) { }
                            if (!(!list || update === true)) return [3 /*break*/, 2];
                            console.log('UPDATE TOP ___->');
                            return [4 /*yield*/, getTop()
                                // @ts-ignore
                            ];
                        case 1:
                            list = _a.sent();
                            // @ts-ignore
                            fs_1["default"].writeFileSync('assets/usersTop.json', JSON.stringify(list), 'utf-8');
                            _a.label = 2;
                        case 2: 
                        // @ts-ignore
                        return [4 /*yield*/, updateTime(JSON.parse(fs_1["default"].readFileSync('assets/usersTop.json')), 'today')
                            // @ts-ignore
                        ];
                        case 3:
                            // @ts-ignore
                            _a.sent();
                            // @ts-ignore
                            return [4 /*yield*/, updateTime(JSON.parse(fs_1["default"].readFileSync('assets/usersTop.json')), 'yesterday')
                                // @ts-ignore
                            ];
                        case 4:
                            // @ts-ignore
                            _a.sent();
                            // @ts-ignore
                            return [4 /*yield*/, updateTime(JSON.parse(fs_1["default"].readFileSync('assets/usersTop.json')), 'twoWeaksAgo')
                                // @ts-ignore
                            ];
                        case 5:
                            // @ts-ignore
                            _a.sent();
                            // @ts-ignore
                            return [4 /*yield*/, updateTime(JSON.parse(fs_1["default"].readFileSync('assets/usersTop.json')), 'allDays')];
                        case 6:
                            // @ts-ignore
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var connection;
        var _this = this;
        return __generator(this, function (_a) {
            connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 't#D82!mP)zK7qWnL',
                database: 'rt5sv_pocketpupsde' // имя базы данных
            });
            connection.connect(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Успешное подключение к базе данных');
            });
            bot_1.bot["catch"](function (e) { return console.log(e); });
            bot_1.notificationBot["catch"](function (e) { return console.log(e); });
            // bot.use(async (ctx, next) => {
            //     console.time(`Processing update ${ctx.update.update_id}`);
            //     await next() // runs next middleware
            //     // runs after next middleware finishes
            //     console.timeEnd(`Processing update ${ctx.update.update_id}`);
            // })
            bot_1.bot.on('chat_join_request', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                var chatId, userId, user_2, profits, user, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            chatId = ctx.update.chat_join_request.chat.id;
                            userId = ctx.update.chat_join_request.from.id;
                            if (!(chatId === config_1.config.chats.chat)) return [3 /*break*/, 2];
                            return [4 /*yield*/, database_1.userRepository.findOne({
                                    where: {
                                        tgId: userId
                                    }
                                })];
                        case 1:
                            user_2 = _a.sent();
                            if (!user_2) {
                                return [2 /*return*/, ctx.api.declineChatJoinRequest(chatId, userId)];
                            }
                            if (user_2.role === user_1.UserRole.WORKER || user_2.role === user_1.UserRole.VBIVER) {
                                return [2 /*return*/, ctx.api.approveChatJoinRequest(ctx.update.chat_join_request.chat.id, ctx.update.chat_join_request.from.id)];
                            }
                            _a.label = 2;
                        case 2:
                            if (chatId !== config_1.config.chats.proChat)
                                return [2 /*return*/];
                            return [4 /*yield*/, database_1.profitRepository.find({
                                    relations: ['worker'],
                                    where: {
                                        worker: {
                                            tgId: userId
                                        }
                                    }
                                })];
                        case 3:
                            profits = _a.sent();
                            return [4 /*yield*/, database_1.userRepository.findOne({
                                    where: {
                                        tgId: userId
                                    }
                                })];
                        case 4:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/];
                            if (!!user.isPro) return [3 /*break*/, 6];
                            return [4 /*yield*/, ctx.api.declineChatJoinRequest(chatId, userId)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, ctx.api.sendMessage(userId, '⚠️ Ты еще не сделал 5 профитов для получения доступа к PRO чату', {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{ text: 'Закрыть', callback_data: 'deleteThisMessage' }]
                                        ]
                                    }
                                })];
                        case 6: return [2 /*return*/, ctx.api.approveChatJoinRequest(ctx.update.chat_join_request.chat.id, ctx.update.chat_join_request.from.id)];
                        case 7:
                            e_1 = _a.sent();
                            console.log(e_1);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); });
            (0, beforeStart_1.beforeStart)();
            bot_1.bot["catch"](function (e) { return console.log(e); });
            bot_1.notificationBot["catch"](function (e) { return console.log(e); });
            (0, runner_1.run)(bot_1.bot).start();
            (0, runner_1.run)(bot_1.notificationBot).start();
            return [2 /*return*/];
        });
    });
}
// process.on('uncaughtException', async (code) => {
//     await axios.post(`https://api.telegram.org/bot6456147214:AAHQK-US4PM2W6rEwWNlJi1ppyrP1qwTv7Y/sendMessage`, {
//         chat_id: -4038244082,
//         text: "Бот упал",
//     }).then(console.log).catch(console.log)
//
//     process.exit(1)
// });
main().then();
