import { Logger } from "typeorm";

export class AppLogger implements Logger {
    public static logError(...message: Array<any>) {
        //TODO: create log file
        console.error('-----------error on: \n');
        console.log(message);
        console.log('-----------');
    }

    public static log(...messages:Array<any>) {
        console.log(messages);
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
}