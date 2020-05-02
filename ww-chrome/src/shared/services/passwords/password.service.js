import {
    CoreService
} from "../core/core.service";
import PasswordSettingsService from './password-settings.service';

export default class PasswordService extends CoreService {
    constructor() {
        super('password');
        this.settings = new PasswordSettingsService();
    }

    // #region helpers
    async generate(length, regex) {
        const passwordSettings = await this.settings.getOrDefults(true);
        return this.util.generatePassword(length, regex, passwordSettings);
    }
    // #endregion helpers

    // #region abstract
    async sync(forece) {
        await this.settings.sync(forece);
        await super.sync(forece);
    };

    async _preSave(item, canUpdate) {
        item.domain = this.util.getDomain(item.domain);
        item.name = this.util.getName(item.domain);

        const oldItem = await this._getOldItem(item, {
            domain: item.domain,
            username: item.username
        });
        
        if (!canUpdate && oldItem && oldItem.id != item.id) {
            // eslint-disable-next-line no-throw-literal
            throw "item-exists";
        }

        if (oldItem && oldItem.id) {
            item.id = oldItem.id;
        }

        if (oldItem && oldItem.serverId) {
            item.serverId = oldItem.serverId;
        }

        if (oldItem && oldItem.count && oldItem.count > item.count) {
            item.count = oldItem.count;
        } else {
            item.count = item.count || 0;
        }

        item.searchField = `${item.name.toLowerCase()}-${item.username.toLowerCase()}`;
        return item;
    }

    _isValidModel(item) {
        return item.domain && item.password;
    }

    async _convertLocalToServerEntity(item) {
        let result = {
            domain: item.domain,
            name: item.name,
            username: item.username,
            password: item.password,
            lastModified: item.lastModified,
            id: item.serverId,
            localId: item.id,
            count: item.count,
            waitTime: item.waitTime
        };

        const ep = await this.encryption.tryEncrypt(result.password);
        if (ep) {
            result.encrypted = ep.encrypted;
            result.password = ep.value;
        }

        return result;
    }

    async _convertServerToLocalEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            domain: item.domain,
            name: item.name,
            username: item.username,
            password: item.password,
            lastModified: item.lastModified,
            serverId: item.id,
            id: item.localId,
            synced: true,
            count: item.count,
            encrypted: item.encrypted,
            waitTime: item.waitTime
        };

        if (result.encrypted) {
            const decrypt = await this.encryption.tryDecrypt(result.password);
            result.password = decrypt.value;
            result.encrypted = !decrypt.decrypted;
        }

        return result;
    }
    // #endregion abstract

    async getOrDefults() {
        let model = await super.get();
        return model || {
            passworIncludeSymbolCharacters: true,
            passwordSymbolCharacters: '!@#$^&*_+~|?=-',
            passwordLength: 20
        };
    }

    // #region import passwords
    async readPasswordsFromFile(file, onSave) {
        let data;
        if (file.type == 'application/json') {
            data = JSON.parse(file.text).passwords.filter(d => d.name);
        } else {
            data = file.text.split('\n').filter(d => /(.)+,(.)+,(.)+,(.)+/.test(d));
        }

        return data;
    }

    async import(passwords, onSaveItem) {
        try {
            if (!passwords || !Array.isArray(passwords) || !passwords.length) {
                return false;
            }

            if (typeof passwords[0] == 'string') {
                passwords = this.getCSVPasswords(passwords);
            }

            passwords.forEach(password => {
                password.synced = true;
            });

            await this.saveOrUpdate(passwords, onSaveItem);
            return true;
        } catch (error) {
            throw error;
        }
    }

    getCSVPasswords(splitText) {
        if (typeof splitText === 'string') {
            splitText = splitText.split('\n');
        }
        let properties = splitText[0].replace('\r', '').split(',');
        let getProperty = function (item, property) {
            let i = properties.indexOf(property);
            return item[i];
        };
        let data = [];
        for (let i = 1; i < splitText.length && /(.)+,(.)+,(.)+,(.)+/.test(splitText[i]); i++) {
            const item = splitText[i].replace('\r', '').split(',');
            data.push({
                domain: this.getDomain(getProperty(item, 'url')),
                name: this.getName(getProperty(item, 'url')) || getProperty(item, 'name'),
                username: getProperty(item, 'username'),
                password: getProperty(item, 'password')
            });
        }

        return data;
    }
    // #endregion import passwords

    // #region get export model
    async export (filter) {
        try {
            let passwords = await this.get(filter);
            for (let i = 0; i < passwords.length; i++) {
                delete passwords[i].id;
                delete passwords[i].searchField;
                delete passwords[i].serverId;
                if (passwords[i].encrypted) passwords[i].password = await this.encryption.decrypt(passwords[i].password);
                delete passwords[i].encrypted;
            }

            let jsonList = JSON.stringify({
                passwords
            });

            const el = document.createElement('a');
            el.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonList));
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            el.setAttribute('download', 'passwords.json');
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
        } catch (error) {
            throw error;
        }
    }
    // #endregion get export model
}