import {
    CoreService
} from "../core/core.service";

export default class CodeGeneratorService extends CoreService {
    constructor() {
        super('codegenerator');
    }

    // #region abstract
    async _preSave(item) {
        const oldPasseord = await this.getItem({
            issuer: item.issuer,
            username: item.username
        });

        if (oldPasseord && oldPasseord.id) {
            item.id = oldPasseord.id;
        }

        if (oldPasseord && oldPasseord.serverId) {
            item.serverId = oldPasseord.serverId;
        }

        item.searchField = `${item.issuer.toLowerCase()}-${item.username.toLowerCase()}`;

        return item;
    }

    _isValidModel(item) {
        return item.issuer && item.username && item.secret;
    }

    async _convertLocalToServerEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            issuer: item.issuer,
            username: item.username,
            secret: item.secret,
            lastModified: item.lastModified,
            id: item.serverId,
            encrypted: item.encrypted
        };

        if (!result.encrypted) {
            const ep = await this.encryption.tryEncrypt(result.secret);
            if (ep) {
                result.encrypted = ep.encrypted;
                result.secret = ep.value;
            }
        }

        return result;
    }

    async _convertServerToLocalEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            issuer: item.issuer,
            username: item.username,
            secret: item.secret,
            lastModified: item.lastModified,
            serverId: item.id,
            encrypted: item.encrypted,
            synced: true
        };

        if (result.encrypted) {
            const decrypt = await this.encryption.tryDecrypt(result.secret);
            result.secret = decrypt.value;
            result.encrypted = !decrypt.decrypted;
        }

        return result;
    }
    // #endregion abstract
}