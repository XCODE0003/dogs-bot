"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lonelyRepository = exports.Lonelypups = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const console_1 = __importDefault(require("console"));
class Lonelypups {
    constructor() { }
    async connect() {
        return promise_1.default.createConnection({
            host: "localhost", // хост базы данных,
            user: "root", // имя пользователя
            password: "t#D82!mP)zK7qWnL", // пароль пользователя
            database: "rt5sv_pocketpupsde", // имя базы данных     
            port: 3306, // порт, на котором установлен MySQL-сервер
        });
    }
    async getOrder(id) {
        const connection = await this.connect();
        let order = undefined;
        try {
            // Выполнение SQL-запроса для получения объекта с id 29 из таблицы orders
            const [rows, fields] = await connection.query("SELECT * FROM orders WHERE id = ?", [id]);
            // Проверка наличия результата
            if (rows["length"] > 0) {
                order = rows[0];
                console_1.default.log("Объект с id 29 из таблицы orders:", order);
            }
            else {
                console_1.default.log("Объект с id 29 не найден в таблице orders");
            }
        }
        catch (error) {
            console_1.default.error("Ошибка при выполнении запроса:", error);
        }
        finally {
            // Закрытие соединения с базой данных
            await connection.end();
        }
        return order;
    }
    async setOrder(id, data) {
        const connection = await this.connect();
        try {
            const [result] = await connection.query("UPDATE orders SET status = ?,comment = ?,error = ? WHERE id = ?", [data["status"], data["comment"], data["error"], id]);
        }
        catch (error) {
            console_1.default.error("Ошибка при выполнении запроса:", error);
        }
        finally {
            // Закрытие соединения с базой данных
            await connection.end();
        }
        return true;
    }
    async setVbiverAndMessageId(id, data) {
        const connection = await this.connect();
        try {
            const [result] = await connection.query("UPDATE orders SET vbiverId = ?,messageId = ? WHERE id = ?", [data["vbiverId"], data["messageId"], id]);
        }
        catch (error) {
            console_1.default.error("Ошибка при выполнении запроса:", error);
        }
        finally {
            // Закрытие соединения с базой данных
            await connection.end();
        }
        return true;
    }
}
exports.Lonelypups = Lonelypups;
exports.lonelyRepository = new Lonelypups();
