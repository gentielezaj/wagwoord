import ChromeService from "./chrome.service";
import { ProxyService } from "./proxy.service";
import * as CryptoJS from 'crypto-js';

export default class UtilService {
    constructor() {
        this.chrome = new ChromeService('util');
        this.proxy = new ProxyService('util');
    }

    async getEcryptionKey() {
        return await this.chrome.get('encryptionKey');
    }

    async getDomain() {
        return this.proxy.getDomain();
    }

    async wizardData() {
        const encryptionKey = await this.getEcryptionKey();
        const domain = await this.getDomain();

        return {
            encryptionKey,
            domain
        };
    }

    async isSetup() {
        return await this.chrome.get('app-is-setup') === 'true';
    }

    async checkProxy() {
        return await this.proxy.checkProxy();
    }

    async save(model) {
        const encryptionHash = model.encryptionKey ? CryptoJS.MD5(model.encryptionKey).toString(CryptoJS.enc.Hex) : '';
        console.log("encryption hash: " + encryptionHash);
        const startUp = await this._startup(model.domain, encryptionHash);
        if(!startUp.success) {
            return false;
        }

        if(model.encryptionKey) {
            await this.chrome.set(model.encryptionKey, 'encryptionKey');
        } else {
            await this.chrome.remove('encryptionKey');
        }

        await this.proxy.save({
            domain: model.domain,
            headers: startUp.data.headers
        });

        await this.proxy.checkProxy();
        await this.chrome.set('app-is-setup', 'true');

        return true;
    }

    async _startup(domain, encryptionHash) {
        let response = await this.proxy.post(encryptionHash, 'startup', 'util', domain);
        return response;
    }
}