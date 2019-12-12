import {
    CoreService
} from "../core/core.service";

export default class CodeGeneratorService extends CoreService {
    constructor() {
        super('codegenerator');
    }

    // #region abstract
    async _preSave(item, canUpdate) {
        const oldPasseord = await this.getItem({
            issuer: item.issuer,
            username: item.username
        });

        if (!canUpdate && oldPasseord && oldPasseord.id != item.id) {
            // eslint-disable-next-line no-throw-literal
            throw "item-exists";
        }

        if (oldPasseord && oldPasseord.id) {
            item.id = oldPasseord.id;
        }

        if (oldPasseord && oldPasseord.serverId) {
            item.serverId = oldPasseord.serverId;
        }

        item.searchField = `${item.issuer.toLowerCase()}-${item.username.toLowerCase()}`;

        return item;
    }

    async save(model, onSaveItem, notlastModified, ignoreServer) {
        if (typeof model == 'string') {
            if (!model.toLocaleLowerCase().startsWith("otpauth://totp/")) {
                // eslint-disable-next-line no-throw-literal
                throw "Invalide otp link";
            }

            let url = new URL(model);
            let params = new URLSearchParams(url.search.slice(1));
            model = {};
            params.forEach((k, v) => {
                model[v] = k;
            });

            model.username = url.pathname.substring(7);
        }

        return await super.save(model, onSaveItem, notlastModified, ignoreServer);
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
            localId: item.id,
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
            id: item.localId,
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