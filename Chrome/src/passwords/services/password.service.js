wwapp.service('$password', function ($rootScope, $database, $settings, $proxy, $encryption, $base) {
    const deletedUnsyncStorageKey = 'passowrds-deleted-unsync';
    const lastModifiedStorageKey = 'passowrds-lastModified';
    const db = $database.init('password');
    const proxy = $proxy.init('passwords');

    let vm = this;

    // #region settings
    vm.settings = function (key) {
        const k = 'password' + (key ? '.' + key : '');
        return $settings.getKey(k);
    };

    vm.saveSettings = function (model) {
        return $settings.save(model, 'password');
    };
    // #endregion settings

    // #region get
    vm.getName = function (domain) {
        if (!domain || domain.startsWith('android:')) return undefined;
        try {
            if (domain.startsWith('http')) {
                let url = new URL(domain);
                domain = url.origin.replace(url.protocol + '//', '').replace('www.', '');
            }
            // if (domain.split('.').length > 2) {
            //     domain = domain.substr(domain.indexOf('.') + 1);
            // }

            return domain;
        } catch (error) {
            //console.log(error);
            return domain;
        }
    };

    vm.getDomain = function (domain) {
        if (!domain || domain.startsWith('android:')) return domain;
        try {
            let url = new URL(domain);
            return url.origin;
        } catch (error) {
            //console.log(error);
            return domain;
        }
    };

    vm.generatePassword = function (length, regex) {
        length = length || vm.settings('passwordLength');
        let string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
        let numeric = '0123456789';
        let punctuation = vm.settings('passworIncludeSymbolCharacters') ? `(?=.*[${vm.settings('passwordSymbolCharacters')}])` : '';
        let password = "";
        let character = "";
        regex = regex || `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)${punctuation}.{1,}$`;
        regex = new RegExp(regex);
        while (password.length < length * 10) {
            entity1 = Math.ceil(string.length * Math.random() * Math.random());
            hold = string.charAt(entity1);
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

        function randomise(password) {
            return password.split('').sort(function () {
                return 0.5 - Math.random();
            }).join('');
        }
    };

    vm.getItemsForDomain = async function (name, username, eq) {
        let store = db.store();
        if (eq == true) {
            store = store.where('name').equalsIgnoreCase(name);
            if (username) store = store.where('username').equalsIgnoreCase(name);
        } else {
            store = store.filter(s => s.name.indexOf(name) > -1);
            if (username) store = store.filter(s => s.username.indexOf(username) > -1);
        }

        return await store.toArray();

        //return await vm.getPasswords();
    };
    // #endregion get

    // #region save
    valideItem = function (item) {
        return item.name && item.password ? true : false;
    };

    preSave = async function (item) {
        if (item.id && item.id > 0 && item.serverId) {
            item.serverId = vm.getItem(item.id).serverId;
        } else {
            const oldPasseord = await db.store.where({
                domain: item.domain,
                username: item.username
            }).first();
            if (oldPasseord) {
                item.id = oldPasseord.id;
                if (!item.serverId) item.serverId = oldPasseord.serverId;
            }
        }

        item.domain = vm.getDomain(item.domain);
        item.name = vm.getName(item.name || item.domain);

        item.searchField = `${item.name.toLowerCase()}-${item.username.toLowerCase()}`;
        return item;
    };
    // #endregion save

    vm.exportPassword = async function (filter) {
        const list = await db('get', filter);
        list.forEach(element => {
            delete element.id;
            delete element.searchField;
            delete element.serverId;
        });

        let jsonList = JSON.stringify({
            data: list
        });

        const el = document.createElement('a');
        el.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonList));
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.setAttribute('download', 'passwords.json');
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    };

    // #region server sync
    async function convertLocalToServerEntity(item) {
        let result = {
            domain: item.domain,
            name: item.name,
            username: item.username,
            password: item.password,
            lastModified: item.lastModified,
            id: item.serverId,
        };

        const ep = await $encryption.encrypt(result.password);
        if (ep != result.password) {
            result.password = ep;
            result.encrypted = true;
        } else {
            result.encrypted = false;
        }

        return result;
    }

    async function convertServerToLocalEntity(item) {
        let result = {
            domain: item.domain,
            name: item.name,
            username: item.username,
            password: item.password,
            lastModified: item.lastModified,
            serverId: item.id,
            synced: true,
            encrypted: item.encrypted
        };

        if (result.encrypted) {
            result.password = await $encryption.decrypt(result.password);
            result.encrypted = false;
        }

        return result;
    }
    // #endregion server sync

    // #region extend

    // baseService = angular.copy($base);

    // baseService.abstract = angular.merge(baseService.abstract, {
    //     deletedUnsyncStorageKey: deletedUnsyncStorageKey,
    //     lastModifiedStorageKey: lastModifiedStorageKey,
    //     db: db,
    //     proxy: proxy,
    //     convertServerToLocalEntity: convertServerToLocalEntity,
    //     convertLocalToServerEntity: convertLocalToServerEntity,
    //     valideItem: valideItem,
    //     preSave: preSave
    // });

    vm = angular.merge($base({
        deletedUnsyncStorageKey: deletedUnsyncStorageKey,
        lastModifiedStorageKey: lastModifiedStorageKey,
        db: db,
        proxy: proxy,
        convertServerToLocalEntity: convertServerToLocalEntity,
        convertLocalToServerEntity: convertLocalToServerEntity,
        valideItem: valideItem,
        preSave: preSave
    }), this);
    // #endregion extend
    return vm;
});