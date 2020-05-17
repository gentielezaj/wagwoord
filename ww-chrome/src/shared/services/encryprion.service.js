import * as CryptoJS from 'crypto-js';
import ChromeService from './chrome.service';

export default class EncryptionService {
    constructor() {
        this.encryptionKeyStorageKey = "encryptionKey";
        this.encryptionStorageKey = "encryption";
        this.encryptionLocalyStorageKey = "encryptionLocal";
        this.chromeService = new ChromeService(this.encryptionStorageKey);
    }

    // #region encryption / decryption
    async tryEncrypt(text, checkLocal) {
        const encryption = await this.get();
        if (this._skipCryption(encryption, checkLocal)) return {
            value: text,
            encrypted: false
        };

        return {
            value: CryptoJS.AES.encrypt(text + '', encryption.encryptionKey).toString(),
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
        const model = await this.chromeService.get(this.encryptionStorageKey) || {};
        if (!model.encryptLocal) {
            model.encryptLocal = false;
        }

        return model && property ? model[property] : model;
    }

    async getKey() {
        return this.get(this.encryptionKeyStorageKey);
    }

    async getHash(key, type) {
        key = key || await this.getKey();
        let hash = '';
        if(key) {
            hash = type ? CryptoJS[type](key).toString() : CryptoJS.SHA512(key).toString();
        }

        return hash;
    }

    async encryptLocal() {
        return await this.get(this.encryptionLocalyStorageKey);
    }

    async save(model) {
        if (typeof model != 'object') {
            let oldModel = await this.get();
            if (model == undefined || model == null || model.isNaN()) {
                oldModel = {
                    encryptLocal: oldModel.encryptLocal
                };
            } else if (typeof model == 'string') {
                oldModel.encryptionKey = model;
            } else if (typeof model == 'boolean') {
                oldModel.encryptLocal = model;
            } else {
                throw new Error("invalide object");
            }

            model = oldModel;
        }

        return await this.coreSave(model);
    }

    async coreSave(model) {
        model.encryptLocal = model.encryptLocal || false;
        this.chromeService.set(model);
    }

    isValid(model) {
        if (!model || typeof model != 'object') return false;
        return model.hasOwnProperty('encryptionKey') && model.hasOwnProperty('encryptLocal');
    }
}