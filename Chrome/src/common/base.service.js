wwapp.service('$base', function () {
    let vm = this;
    let abstract = {};

    // #region get
    vm.getItems = function (filter) {
        return abstract.db.get(filter);
    };

    vm.getList = function (filter) {
        return abstract.db.getList(filter);
    };

    vm.getItem = function (id) {
        if (!id) return undefined;
        return abstract.db.getItem(id);
    };
    // #endregion get

    // #region save
    vm.save = async function (item, notlastModified, ignoreServer, onSaveItem) {
        if (!abstract.valideItem(item)) {
            return false;
        }

        if(abstract.preSave && angular.isFunction(abstract.preSave)) {
            item = await abstract.preSave(item);
        }

        let old = await vm.getItem(item.id);
        if (old) {
            item.serverId = item.serverId;
        }

        item.synced = item.synced || false;
        if (!notlastModified || !item.lastModified) item.lastModified = new Date().getTime();
        item.id = await abstract.db.save(item);
        if (item.id && !ignoreServer && item.synced === true) {
            await vm.updateServer(item);
        }

        if(onSaveItem && angular.isFunction(onSaveItem)) {
            onSaveItem(item);
        }

        return item.id;
    };
    // #endregion save

    // #region delete
    vm.delete = async function (id) {
        const item = await vm.getItem(id);
        if (!item) return true;
        const deleted = await abstract.db.delete(id);
        if (deleted && item.serverId && !(await abstract.proxy.delete(item.serverId)).success) {
            let unsyced = localStorage.getItem(abstract.deletedUnsyncStorageKey);
            unsyced = unsyced ? unsyced.split(',') : [];
            unsyced.push(item.serverId);
            localStorage.setItem(abstract.deletedUnsyncStorageKey, unsyced.join(','));
        }

        return deleted;
    };

    vm.deleteAll = async function () {
        if ((await abstract.proxy.deleteAll()).success)
            return await abstract.db.deleteAll();

        return false;
    };
    // #endregion delete

    // #region server sync

    vm.update = async function () {
        const deleted = await vm.updateDeleted();
        const local = await vm.updateFromServer();
        const server = await vm.updateServer();
        return deleted && local && server ? true : false;
    };

    vm.updateDeleted = async function() {
        let deleted = localStorage.getItem(abstract.deletedUnsyncStorageKey);
        if(!deleted || !deleted.length) return true;
        let result = await abstract.proxy.delete(deleted);
        if(result.success === true) {
            localStorage.removeItem(abstract.deletedUnsyncStorageKey);
        }
        return result.success;
    };

    vm.updateFromServer = async function () {
        let password = (await store.orderBy('lastModified').reverse().first()) || {};
        let localStorageLastModified = localStorage.getItem(abstract.lastModifiedStorageKey);
        const lastModified = password.lastModified > localStorageLastModified ? password.lastModified : localStorageLastModified;
        
        const data = await abstract.proxy.patch(lastModified || 0);
        const result = await abstract.saveServerItemsLocaly(data);
        return result;
    };

    abstract.saveServerItemsLocaly = async function(response, onSaveItem) {
        if (response.success === true) {
            if (Array.isArray(response.data))
                for (let i in response.data) {
                    await abstract.saveServerItemLocaly(response.data[i], onSaveItem);
                }
            else await abstract.saveServerItemLocaly(response.data, onSaveItem);

            return true;
        }
        return false;
    };

    abstract.saveServerItemLocaly = async function(item, onSaveItem) {
        if(item.deleted == 1) {
            const localItem = await abstract.db.store.where({serverId: item.id}).first();
            if(localItem) await vm.delete();

            let lastModified = localStorage.getItem(abstract.lastModifiedStorageKey);
            if(lastModified < localItem.lastModified) {
                localStorage.setItem(abstract.lastModifiedStorageKey, localItem.lastModified);
            }

            return item.id;
        }

        item = await abstract.convertServerToLocalEntity(item);

        return await vm.save(item, true, true, onSaveItem);
    };

    vm.updateServer = async function(items, onSaveItem) {
        if (!items) {
            var res = await abstract.proxy.patch();
            if (!res.success) {
                return false;
            }

            items = await abstract.db.store.filter(p => p.lastModified > res.data && p.synced).toArray();
        } else if (items === 'all') {
            items = await abstract.db.store.toArray();
        } else if (!Array.isArray(items)) {
            items = [items];
        }

        
        if (!items.length) return true;

        for (let i = 0; i < items.length; i++) {
            items[i] = await abstract.convertLocalToServerEntity(items[i]);
        }

        var result = await abstract.proxy.post(items);
        if(result.success) {
            await abstract.saveServerItemsLocaly(result, onSaveItem);
        }

        return result.success;
    };
    // #endregion server sync

    return function(a) {
        abstract = angular.merge(abstract, a);
        return angular.copy(vm);
    };
});