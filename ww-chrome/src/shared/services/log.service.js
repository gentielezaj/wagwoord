import {
    WWUtil
} from '../util/ww-util';
import DB from './database/db.service';

export default class Log {
    constructor() {
        this.util = WWUtil;
        this.db = new DB('log');
    }

    async save(log) {
        await this.db.save(log);
    }

    async getItem(id) {
        await this.db.getItem(id);
    }

    async list(query) {
        if(!query.order) {
            query.order = {
                property: 'time',
                desc: true
            };
        }

        let list = await this.get(query);
        let count = await this.db.count(query);
        return {
            list,
            count
        };
    }

    static error(...message) {
        Log.log('error', ...message);
    }

    static info(...message) {
        Log.log('info', ...message);
    }

    static proxy(...message) {
        Log.log('proxy', ...message);
    }

    static log(type, ...messages) {
        if(!messages?.length) return;

        let message = messages.join("\n");

        new Log().save({
            type,
            message,
            time: new Date().getTime()
        }).then();
    }
}