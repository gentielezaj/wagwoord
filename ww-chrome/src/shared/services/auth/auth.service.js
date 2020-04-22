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

    getProxyStatus(force) {
        return this.proxy.getProxyStatus(force);
    }

    checkProxy() {
        return this.proxy.checkProxy();
    }

    async loginData() {
        let data = await this.encryptionService.get();
        data.domain = await this.proxy.settings.getDomain();
        return data;
    }

    async credentialsFor(encryptionKey) {
        if(await this.proxy.getProxyStatus(false) == 'off') return 'login';
        return await this.proxy.credentialsFor(encryptionKey);
    }

    async login(domain, encryptionKey, encryptLocal, request) {
        try {
            if (domain) {
                const hash = await this.encryptionService.getHash(encryptionKey);
                let headers = await this.proxy.settings.get('headers');
                headers = {
                    ...headers,
                    "Content-Type": "application/json"
                };

                const response = await this.proxy.postRequest(request, {
                    encryptionHash: hash
                }, undefined, undefined, domain, headers);

                if(!response.success) return false;
                
                await this.encryptionService.save({
                    encryptionKey: encryptionKey,
                    encryptLocal: encryptLocal
                });

                await this.proxy.settings.save({
                    domain,
                    headers: response.data.headers
                });

                return await this.checkProxy();
            } else {
                await this.proxy.settings.removeDomain();
                await this.encryptionService.save({
                    encryptionKey: encryptionKey,
                    encryptLocal: encryptLocal
                });
            }
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}