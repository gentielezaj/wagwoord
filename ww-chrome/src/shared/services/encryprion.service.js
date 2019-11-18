import ChromeService from './chrome.service';
import * as CryptoJS from 'crypto-js';

export default class EncryptionService {
    constructor() {
        this.chrome = new ChromeService('encryption');
    }

    // #region encryption / decryption
    async tryEncrypt(text, checkLocal) {
        const encryption = await this.get();
        if (this._skipCryption(encryption, checkLocal)) return {
            value: text,
            encrypted: false
        };

        return  {
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
        return !encryption || !encryption.encryptionKey || (checkLocal && !encryption.encryptLocal);
    }
    // #endregion encryption / decryption

    async get(property) {
        const model = await this.chrome.get();
        return model && property ? model[property] : model;
    }

    async save(model) {
        if (model === undefined || model == null) return false;
        if (this.isValid(model)) {
            await this.chrome.set(model);
            return true;
        }

        let item = (await this.get()) || {};

        if (typeof model == 'string' && model !== 'false' && model !== 'true') {
            item.encryptionKey = model;
        } else item.encryptLocal = typeof model == 'boolean' ? model : (model == 'true');

        try {
            await this.chrome.set(item);
            return true;
        } catch (error) {
            throw error;
        }
    }

    isValid(model) {
        if (!model || typeof model != 'object') return false;
        return model.hasOwnProperty('encryptionKey') && model.hasOwnProperty('encryptLocalty');
    }
}