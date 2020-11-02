import { Logger } from "typeorm";
import * as fs from 'fs';

export class AppLogger implements Logger {
    public static logError(...message: Array<any>) {
        AppLogger.writeToFile(LogType.Error, ...message)
    }

    public static error(...message: Array<any>) {
        AppLogger.writeToFile(LogType.Error, ...message)
    }

    public static info(...message: Array<any>) {
        AppLogger.writeToFile(LogType.Info, ...message)
    }

    public static log(...messages:Array<any>) {
        AppLogger.writeToFile(LogType.Info, ...messages);
    }

    public logQuery(query: string, parameters?: any[] | undefined, queryRunner?: import("typeorm").QueryRunner | undefined) {
    }
    public logQueryError(error: string, query: string, parameters?: any[] | undefined, queryRunner?: import("typeorm").QueryRunner | undefined) {
        AppLogger.logError(error, query, parameters);
    }
    public logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: import("typeorm").QueryRunner | undefined) {
    }
    public logSchemaBuild(message: string, queryRunner?: import("typeorm").QueryRunner | undefined) {
    }
    public logMigration(message: string, queryRunner?: import("typeorm").QueryRunner | undefined) {
        AppLogger.log("migration:", message);
    }
    public log(level: "log" | "info" | "warn", message: any, queryRunner?: import("typeorm").QueryRunner | undefined) {
        AppLogger.log('-------' + level, message);
    }

    private static writeToFile(type: LogType, ...message: Array<any>) {
        if ((message?.length ?? 0) <= 0) return;
        let msg = message.join('\n');
        const dir = __dirname + "/../logs/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const date = new Date();
        const name = `${type}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.txt`;
        const path = dir + "/" + name;
        if (fs.existsSync(path)) {
            msg = fs.readFileSync(path, 'utf8') + "\n" + msg;
        }

        if (process.env.NODE_ENV == 'dev') {
            console.log(type + " ---- " + msg);
        }

        fs.writeFileSync(path, msg);
    }
}

enum LogType {
    Info = "INFO",
    Error = "ERROR",
    Waring = "WARING"
}