import {
    ProxyService
} from '../proxy.service';
import ChromeService from '../chrome.service';
import EncryptionService from '../encryprion.service';

export class AuthService {
    constructor() {
        this.proxy = new ProxyService("Auth");
        this.chromeService = new ChromeService();
        this.encryptionService = new EncryptionService();
    }

    async checkProxy() {
        return await this.proxy.checkProxy();
    }

    async login(domain, encryptionKey, encryptLocal) {
        try {
            await this.encryptionService.save({
                encryptionKey: encryptionKey,
                encryptLocal: encryptLocal
            });

            if (domain) {
                const hash = await this.encryptionService.getHash();
                const response = await this.proxy.postRequest('login', {
                    encryptionHash: hash
                }, undefined, undefined, domain);

                if(!response.success) return false;

                await this.proxy.save({
                    domain,
                    headers: response.data
                });

                return await this.proxy.checkProxy();
            }
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}