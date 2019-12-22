import {
    CoreService
} from "../core/core.service";

import authenticator from "otplib/authenticator";
import crypto from "crypto";

export default class CodeGeneratorService extends CoreService {
    constructor() {
        super('codegenerator');
    }

    getDefaultModel(skipEpoch) {
        let model = {
            digits: 6,
            encoding: 'hex',
            algorithm: 'sha1',
            step: 30,
            window: 0
        };
        if (!skipEpoch) {
            model.epoch = Date.now();
        }
        return model;
    }

    assigneDefaultValues(item, isForm) {
        return isForm ? {
            ...authenticator.defaultOptions,
            ...this.getDefaultModel(isForm),
            ...item
        } : {
            ...authenticator.optionsAll,
            ...this.getDefaultModel(),
            ...item,
            crypto
        };
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
        model = this._getModel(model);
        if(!model.issuer || !model.secret || !model.username) return false;
        return await super.save(model, onSaveItem, notlastModified, ignoreServer);
    }

    _getModel(model) {
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

            model.synced = true;
            model.username = url.pathname.substring(7);
            if (model.username && model.username.indexOf(':') > -1) {
                model.username = model.username.substring(model.username.indexOf(':') + 1, model.username.length);
            }
            
            if (model.username && model.username.indexOf('@') > -1) {
                model.username = model.username.substring(model.username.indexOf('@') + 1, model.username.length);
            }
        }

        return model;
    }

    async saveOrUpdate(model, onSaveItem, notlastModified, ignoreServer) {
        model = this._getModel(model);
        if(!model.issuer || !model.secret || !model.username) return false;
        return await super.saveOrUpdate(model, onSaveItem, notlastModified, ignoreServer);
    }

    async getItemWithCode(item) {
        if(typeof item == 'number') {
            item = await this.getItem(item);
        }
        item.code = await this.generateCodeForItem(item);
        return item;
    }

    async generateCodeForItem(item) {
        if(typeof item == 'number') {
            item = await this.getItem(item);
        }

        authenticator.options = this.assigneDefaultValues(item);
        return authenticator.generate(item.secret);
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
            encrypted: item.encrypted,
            digits: item.digits || 6,
            encoding: item.encoding || 'ascii',
            algorithm: item.algorithm || 'sha1',
            epoch: item.epoch,
            step: item.step || 30,
            window: item.window || 0,
            icon: item.icon
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
            synced: true,
            digits: item.digits || 6,
            encoding: item.encoding || 'ascii',
            algorithm: item.algorithm || 'sha1',
            epoch: item.epoch,
            step: item.step || 30,
            window: item.window || 0,
            icon: item.icon
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