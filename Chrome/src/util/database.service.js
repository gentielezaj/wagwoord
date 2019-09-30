wwapp.factory('$database', function ($rootScope) {
    let vm = this;
    const dbName = "wagwoord-db";

    // #region db
    function getDb(store, write) {
        try {
            let db = new Dexie(dbName);
            db.version(1).stores({
                password: '++id,name,domain,username,searchField,serverId,lastModified,encrypted,synced'
            });

            return db;
        } catch (error) {
            console.error('error opeing database ' + dbName);
            console.log(error);
        }
    }

    vm.store = function (store) {
        let db = getDb();
        return db[store];
    };
    // #endregion db

    // #region save
    vm.save = async function (store, item) {
        let f = '';
        delete item.$$hashKey;
        if (!item.id || item.id <= 0) {
            delete item.id;
            f = 'add';
        } else {
            f = 'put';
        }

        try {
            return await vm.store(store)[f](item);
        } catch (error) {
            console.error(`error saving ${store} id: ${item.id}`);
            console.log(error);
            return undefined;
        }
    };
    // #endregion save

    // #region get
    vm.get = async function (store, query) {
        try {
            let os = vm.store(store);
            if(!query) {
                return await os.toArray();
            }
            if(query.searchText) {
                query.searchText = query.searchText.toLowerCase();
                os = os.filter(i => i.searchField.indexOf(query.searchText) > -1);
            }
            if(query.skip > 0) {
                os = os.offset(query.take);
            }
            if(query.take > 0) {
                os = os.limit(query.take);
            }
            if(query.order) {
                if(typeof query.order === 'string' || query.order.property) 
                    os.orderBy(query.order.property || query.order);
                if(query.order.desc)
                    os.reverse();
            }

            return await os.toArray();
        } catch (error) {
            console.error(`error geting ${store}`);
            console.log(error);
            return undefined;
        }
    };

    vm.count = async function (store, query) {
        try {
            let os = vm.store(store);
            if(!query) {
                return await os.toArray();
            }
            if(query.searchText) {
                query.searchText = query.searchText.toLowerCase();
                os = os.filter(i => i.searchField.indexOf(query.searchText) > -1);
            }

            return await os.count();
        } catch (error) {
            console.error(`error geting ${store}`);
            console.log(error);
            return undefined;
        }
    };

    vm.getList = async function(store, query) {
        let list = await vm.get(store, query);
        let count = await vm.count(store, query);

        return {
            list: list,
            count: count
        };
    };

    vm.getItem = async function (store, id) {
        try {
            return await vm.store(store).where({id: id}).first();
        } catch (error) {
            console.error(`error geting item ${store} id:${id}`);
            console.log(error);
            return undefined;
        }
    };
    // #endregion get

    // #region delete
    vm.delete = async function (store, id) {
        try {
            await vm.store(store).delete(id);
            return true;
        } catch (error) {
            console.error(`error deleting ${store} id: ${id}`);
            console.log(error);
            return false;
        }
    };

    vm.deleteAll = async function(store) {
        try {
            await vm.store(store).clear();
            return true;
        } catch (error) {
            console.error(`error deleting all from ${store}`);
            console.log(error);
            return false;
        }
    };
    // #endregion delete

    return vm;
});