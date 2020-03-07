import * as CryptoJS from 'crypto-js';
import UtilService from './util.service';

export default class EncryptionService {
    constructor() {
        this.utilService = new UtilService();
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
        const model = { encryptionKey: await this.utilService.getEcryptionKey(), encryptLocal: false };

        return model && property ? model[property] : model;
    }

    async save(model) {
        
    }

    async coreSave(model) {
        
    }

    isValid(model) {
        if (!model || typeof model != 'object') return false;
        return model.hasOwnProperty('encryptionKey') && model.hasOwnProperty('encryptLocalty');
    }
}