import ChromeService from "./chrome.service";

export default class AppService {
    constructor() {
        this.chrome = new ChromeService('app');
        this.defaults = {
            isFirstStart: false
        };
    }

    async data(key) {
        let data = await this.chrome.get();
        if(!data) data = this.defaults;
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
}