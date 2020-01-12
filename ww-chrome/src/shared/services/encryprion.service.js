import ChromeService from './chrome.service';
import * as CryptoJS from 'crypto-js';
import {
    ProxyService
} from './proxy.service';

export default class EncryptionService {
    constructor() {
        this.proxy = new ProxyService('util');
        this.chrome = new ChromeService('encryption');
    }

    async checkProxy() {
        return this.proxy.checkProxy();
    }

    // #region encryption / decryption
    async tryEncrypt(text, checkLocal) {
        const encryption = await this.get();
        if (this._skipCryption(encryption, checkLocal)) return {
            value: text,
            encrypted: false
        };

        return {
            value: CryptoJS.AES.encrypt(text, encryption.encryptionKey).toString(),
            encrypted: true
        };
    }

    async encrypt(text, checkLocal) {
        const encryptValue = await this.tryEncrypt(text, checkLocal);
        return encryptValue.value;
    }

    async tryDecrypt(text, checkLocal) {
        const encryption = await this.get();
        if (this._skipCryption(encryption, checkLocal)) return {
            value: text,
            decrypted: false
        };

        return {
            value: CryptoJS.AES.decrypt(text, encryption.encryptionKey).toString(CryptoJS.enc.Utf8),
            decrypted: true
        };
    };

    async decrypt(text, checkLocal) {
        const decryptValue = await this.tryDecrypt(text, checkLocal);
        return decryptValue.value;
    };

    _skipCryption(encryption, checkLocal) {
        return !encryption || !encryption.encryptionKey || typeof encryption.encryptionKey !== 'string' || encryption.encryptionKey.trim() === '' || (checkLocal && !encryption.encryptLocal);
    }
    // #endregion encryption / decryption

    async get(property) {
        const model = await this.chrome.get();
        return model && property ? model[property] : model;
    }

    async save(model) {
        if (model === undefined || model == null) return false;
        if (this.isValid(model)) {
            await this.coreSave(model);
            return true;
        }

        let item = (await this.get()) || {};

        if (typeof model == 'string' && model !== 'false' && model !== 'true') {
            item.encryptionKey = model;
        } else item.encryptLocal = typeof model == 'boolean' ? model : (model == 'true');

        try {
            await this.coreSave(item);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async coreSave(model) {
        const encryptionHash = model.encryptionKey ? CryptoJS.MD5(model.encryptionKey).toString(CryptoJS.enc.Base64) : '';
        try {
            if (await this.proxy.isSet()) {
                const headers = await this.proxy.post({
                        encryptionHash: encryptionHash || ''
                    },
                    undefined,
                    'encryptionHash'
                );
                if(headers.success)
                    this.proxy.settings.setHeaders(headers.data.headers);
            } else {
                console.log('encry set ');
                if(encryptionHash) await this.proxy.settings.addHeaders({ encryptionHash });
                else await this.proxy.settings.removeHeaders('encryptionHash');
            }

            await this.proxy.checkProxy();
            
            await this.chrome.set(model);
        } catch (error) {
            throw error;
        }
    }

    isValid(model) {
        if (!model || typeof model != 'object') return false;
        return model.hasOwnProperty('encryptionKey') && model.hasOwnProperty('encryptLocalty');
    }
}