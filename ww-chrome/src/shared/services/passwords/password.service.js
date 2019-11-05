import {
    CoreService
} from "../core/core.service";
import PasswordSettingsService from './password-settings.service';
import {
    getTextFromFile
} from '../core/helper.service';

export default class PasswordService extends CoreService {
    constructor() {
        super('password');
        this.settings = new PasswordSettingsService();
    }

    // #region helpers

    getName(domain, min) {
        domain = this.getDomain(domain);
        domain = domain.replace(/http(s)?:\/\//, '');
        if (!min || !/[a-zA-Z]+/.test(domain)) {
            return domain;
        }
        let splitedDomain = domain.split('.');
        if (splitedDomain.length <= 2) return domain;
        return splitedDomain[splitedDomain.length - 2] + '.' + splitedDomain[splitedDomain.length - 1];
    }

    getDomain(domain) {
        if (!domain || domain.startsWith('android:')) return domain;
        if (!(/http(s)?:/.test(domain))) {
            return domain;
        }
        try {
            let url = new URL(domain);
            return url.port ? url.origin.replace(`:${url.port}`, '') : url.origin;
        } catch (error) {
            throw error;
        }
    }

    async generate(length, regex) {
        const passwordSettings = await this.settings.getOrDefults(true);
        length = length || passwordSettings.passwordLength;
        let string = "abcdefghijklmnopqrstuvwxyz";
        let numeric = '0123456789';
        let punctuation = passwordSettings.passworIncludeSymbolCharacters ? `(?=.*[${passwordSettings.passwordSymbolCharacters}])` : '';
        let password = "";
        let character = "";
        regex = regex || `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)${punctuation}.{1,}$`;
        regex = new RegExp(regex);
        while (password.length < length * 10) {
            let entity1 = Math.ceil(string.length * Math.random() * Math.random());
            let hold = string.charAt(entity1);
            hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
            character += hold;
            character += numeric.charAt(Math.ceil(numeric.length * Math.random() * Math.random()));
            if (punctuation.length) {
                character += punctuation.charAt(Math.ceil(punctuation.length * Math.random() * Math.random()));
            } else {
                let char = string.charAt(Math.ceil(string.length * Math.random() * Math.random()));
                character += (password.length % 2 == 0) ? char.toLowerCase() : char.toUpperCase();
            }
            password = character;
        }

        password = randomise(password);

        for (let index = length; index < password.length - length; index++) {
            let element = password.substr(index, length);
            if (regex.test(element)) return element;
            if (index + length >= password.length) {
                password = randomise(password);
                index = length;
            }
        }

        return password;

        function randomise(password) {
            return password.split('').sort(function () {
                return 0.5 - Math.random();
            }).join('');
        }
    }
    // #endregion helpers

    // #region abstract
    async _preSave(item) {
        item.domain = this.getDomain(item.domain);
        item.name = this.getName(item.name || item.domain);

        const oldPasseord = await this.getItem({
            domain: item.domain,
            username: item.username
        });

        if (oldPasseord && oldPasseord.id) {
            item.id = oldPasseord.id;
        }

        if (oldPasseord && oldPasseord.serverId) {
            item.serverId = oldPasseord.serverId;
        }

        if (oldPasseord && oldPasseord.count && oldPasseord.count > item.count) {
            item.count = oldPasseord.count;
        } else {
            item.count = item.count || 0;
        }

        item.searchField = `${item.name.toLowerCase()}-${item.username.toLowerCase()}`;
        return item;
    }

    _isValidModel(item) {
        return item.name && item.password;
    }

    async _convertLocalToServerEntity(item) {
        let result = {
            domain: item.domain,
            name: item.name,
            username: item.username,
            password: item.password,
            lastModified: item.lastModified,
            id: item.serverId,
            count: item.count
        };

        const ep = await this.encryption.encrypt(result.password);
        if (ep != result.password) {
            result.password = ep;
            result.encrypted = true;
        } else {
            result.encrypted = false;
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
            synced: true,
            count: item.count,
            encrypted: item.encrypted
        };

        if (result.encrypted) {
            result.password = await this.encryption.decrypt(result.password);
            result.encrypted = false;
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
        const fileText = await getTextFromFile(file);
        let data;
        if (file.type == 'application/json') {
            data = JSON.parse(fileText).passwords.filter(d => d.name);
        } else {
            data = fileText.split('\n').filter(d => /(.)+,(.)+,(.)+,(.)+/.test(d));
        }

        return data;
    }

    async import(passwords, onSaveItem) {
        if (!passwords || !Array.isArray(passwords) || !passwords.length) {
            return false;
        }

        if (typeof passwords[0] == 'string') {
            passwords = this.getCSVPasswords(passwords);
        }

        await this.syncServer(passwords, onSaveItem);
        return true;
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
                if(passwords[i].encrypted) passwords[i].password = await this.encryption.decrypt(passwords[i].password);                
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