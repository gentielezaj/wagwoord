import ChromeService from "./chrome.service";
import {
    ProxyService
} from './proxy.service';

export default class AppService {
    constructor() {
        this.proxy = new ProxyService('info');
        this.chrome = new ChromeService('app');
        this.defaults = {
            isFirstStart: false
        };
    }

    async data(key) {
        let data = await this.chrome.get();
        if (!data) data = this.defaults;
        else {
            data = {
                ...this.defaults,
                ...data
            };
        }

        return key ? data[key] : data;
    }

    async setData(data) {
        const old = await this.data();
        data = {
            ...old,
            ...data
        };

        await this.chrome.set(data);

        return true;
    }

    async isSetUp() {
        this.chrome.get();
    }

    get varsion() {
        return this.chrome.version;
    }

    async apiRequest(model) {
        console.log(model);
        return await this.proxy.request(model.method || 'GET', model.data, model.params, model.action, model.controller, model.domain, model.headers);
    }
}