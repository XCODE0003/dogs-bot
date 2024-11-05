import mysql from "mysql2/promise";
import console from "console";

export class Lonelypups {
  constructor() {}

  async connect(): Promise<mysql.Connection> {
    return mysql.createConnection({
      host: "localhost", // хост базы данных,
      user: "root", // имя пользователя
      password: "t#D82!mP)zK7qWnL", // пароль пользователя
      database: "rt5sv_pocketpupsde", // имя базы данных     
    
      port: 3306, // порт, на котором установлен MySQL-сервер
    });
  }

  async getOrder(id: number) {
    const connection = await this.connect();
    let order = undefined;

    try {
      // Выполнение SQL-запроса для получения объекта с id 29 из таблицы orders
      const [rows, fields] = await connection.query(
        "SELECT * FROM orders WHERE id = ?",
        [id]
      );

      // Проверка наличия результата
      if (rows["length"] > 0) {
        order = rows[0];
        console.log("Объект с id 29 из таблицы orders:", order);
      } else {
        console.log("Объект с id 29 не найден в таблице orders");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    } finally {
      // Закрытие соединения с базой данных
      await connection.end();
    }

    return order;
  }
  async setOrder(id: number, data) {
    const connection = await this.connect();

    try {
      const [result] = await connection.query(
        "UPDATE orders SET status = ?,comment = ?,error = ? WHERE id = ?",
        [data["status"], data["comment"], data["error"], id]
      );
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    } finally {
      // Закрытие соединения с базой данных
      await connection.end();
    }

    return true;
  }
  async setVbiverAndMessageId(id: number, data: Object) {
    const connection = await this.connect();

    try {
      const [result] = await connection.query(
        "UPDATE orders SET vbiverId = ?,messageId = ? WHERE id = ?",
        [data["vbiverId"], data["messageId"], id]
      );
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    } finally {
      // Закрытие соединения с базой данных
      await connection.end();
    }

    return true;
  }

}

export const lonelyRepository = new Lonelypups();
