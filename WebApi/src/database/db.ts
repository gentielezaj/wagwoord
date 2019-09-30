import { ConnectionOptions, createConnection, Connection, Repository, ObjectType } from "typeorm";
import { BaseEntity } from "./models/baseEntity";
import { PasswordEntity } from "./models/passwordEntity";
import { Logger } from "../utils/logger";

const databasePath = process.env.DATABASE_PATH;
export const options: ConnectionOptions = {
    type: "sqlite",
    database: `${__dirname}${databasePath}`,
    entities: [PasswordEntity],
    logging: true
}

export class Db {
    public connection: Connection;

    constructor() {
        //this.init().then();
    }

    protected async init() {
        const databasePath = process.env.DATABASE_PATH;
        const options: ConnectionOptions = {
            type: "sqlite",
            database: `${__dirname}\\${databasePath}`,
            entities: [PasswordEntity],
            logging: true
        }
        this.connection = await createConnection(options);
    }

    protected async getRepository<T extends BaseEntity>(entity: ObjectType<T>): Promise<Repository<T>> {
        await this.init();
        return this.connection.getRepository<T>(entity);
    }

    public async save<T extends BaseEntity>(entity: ObjectType<T>, model: T): Promise<T|undefined> {
        try {
            const repository = await this.getRepository<T>(entity);
            const id = await repository.save(<any>model);
            await this.connection.close();
            //model.id = id;
            return model;
        } catch (error) {
            this.connection.close();
            Logger.logError(error);
        }
    }

    // #region get data

    public async getById<T extends BaseEntity>(entity: ObjectType<T>, id: number): Promise<T | undefined> {
        try {
            const repository = await this.getRepository<T>(entity);
            const res =  await repository.findOne(id);
            await this.connection.close();
            return res;
        } catch (error) {
            this.connection.close();
            Logger.logError(error);
        }
    }

    public async getAll<T extends BaseEntity>(entity: ObjectType<T>): Promise<Array<T> | undefined> {
        try {
            const repository = await this.getRepository<T>(entity);
            const results = await repository.find();
            await this.connection.close();
            if(results) return results;
            return new Array<T>();
        } catch (error) {
            this.connection.close();
            Logger.logError(error);
        }
    }
    
    // #endregion get data

}