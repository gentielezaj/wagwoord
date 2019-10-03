wwapp.factory('$password', function ($rootScope, $database, $settings, $proxy, $encryption) {
    let vm = this;

    const passwordsDeletedUnsyncKey = 'passowrds-deleted-unsync';
    const passwordStore = $database.store('password');
    const passwordProxy = $proxy.init('passwords');

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
            let url = new URL(domain);
            domain = url.origin.replace(url.protocol + '//', '').replace('www.', '');
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

    vm.getPasswords = async function (filter) {
        const list = await db('get', filter);
        const total = await db('count', filter);
        return {
            data: list,
            total: total
        };
    };

    vm.getItem = async function (id) {
        if (!id) return {};
        return await db('getItem', id);
    };

    vm.getItemsForDomain = async function (name, username, eq) {
        let store = $database.store('password');
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
    vm.validePassword = function (item) {
        return item.name && item.username && item.password ? true : false;
    };

    vm.savePassword = async function (item, notlastModified, ignoreServer) {
        if (!vm.validePassword(item)) {
            return false;
        }

        if (item.id && item.id > 0 && item.serverId) {
            item.serverId = vm.getItem(item.id).serverId;
        } else {
            const oldPasseord = await passwordStore.where({
                domain: item.domain,
                username: item.username
            }).first();
            if (oldPasseord) {
                item.id = oldPasseord.id;
                if (!item.serverId) item.serverId = oldPasseord.serverId;
            }
        }

        item.searchField = `${item.name.toLowerCase()}-${item.username.toLowerCase()}`;
        if (!notlastModified || !item.lastModified) item.lastModified = new Date().getTime();
        item.id = await $database.save('password', item);
        if(item.id && !ignoreServer) {
            vm.updateServer(item);
        }

        return item.id;
    };
    // #endregion save

    // #region delete
    vm.delete = async function (id) {
        const password = await vm.getItem(id);
        let deleted = await db('delete', id);
        if (deleted && !(await passwordProxy.delete(password.serverId)).success) {
            let unsyced = localStorage.getItem(passwordsDeletedUnsyncKey);
            unsyced = unsyced ? unsyced.split[','] : [];
            unsyced.push(serverId);
            localStorage.setItem(passwordsDeletedUnsyncKey, unsyced.join(','));
        }

        return deleted;
    };

    vm.deleteAll = async function () {
        if (await db('deleteAll')) {
            await passwordProxy.deleteAll();
        }
    };
    // #endregion delete

    async function db(operation, data) {
        return await $database[operation]('password', data);
    }

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

    vm.update = async function () {
        await vm.updateFromServer();
        await vm.updateServer();
    };

    vm.updateFromServer = async function () {
        const lastModified = await passwordStore.orderBy('lastModified').reverse().first();
        if (!lastModified) return;

        const data = await passwordProxy.patch(lastModified.lastModified || 0);
        saveServerPasswords(data);
    };

    vm.updateServer = async function (passwords) {
        if (!passwords) {
            var res = await passwordProxy.patch();
            if (!res.success) {
                throw new Exeption('server error');
            }

            passwords = await passwordStore.where('lastModified').above(res.data).toArray();
        } else if (!Array.isArray(passwords)) {
            passwords = [passwords];
        }

        if (!passwords.length) return;

        for (let i = 0; i < passwords.length; i++) {
            passwords[i] = {
                domain: passwords[i].domain,
                name: passwords[i].name,
                username: passwords[i].username,
                password: passwords[i].password,
                searchField: passwords[i].searchField,
                lastModified: passwords[i].lastModified,
                id: passwords[i].serverId,
            };

            const ep = await $encryption.encrypt(passwords[i].password);
            if (ep != passwords[i].password) {
                passwords[i].password = ep;
                passwords[i].encrypted = true;
            } else {
                passwords[i].encrypted = false;
            }
        }

        let presults = await passwordProxy.post(passwords);
        saveServerPasswords(presults);
    };

    async function saveServerPasswords(data) {
        if (data.success === true) {
            if (Array.isArray(data.data))
                for (let ps in data.data) {
                    saveServerPassword(data.data[ps]);
                }
            else saveServerPassword(data.data);
        }
    }

    async function saveServerPassword(p) {
        if(p.deleted == 1) {
            const item = await passwordStore.where({serverId: p.id}).first();
            if(item) await vm.delete();
            return p.id;
        }

        let rp = {
            domain: p.domain,
            name: p.name,
            username: p.username,
            password: p.password,
            searchField: p.searchField,
            lastModified: p.lastModified,
            serverId: p.id,
            synced: true,
            encrypted: p.encrypted
        };

        if (rp.encrypted) {
            rp.password = await $encryption.decrypt(rp.password);
            rp.encrypted = false;
        }

        return await vm.savePassword(rp, true, true);
    }
    // #endregion server sync

    return vm;
});