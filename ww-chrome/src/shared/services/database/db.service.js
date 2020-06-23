import db from './db-init.service';

export default class DB {
    constructor(store) {
        this.storeName = store;
        this.db = db;
    }

    get store() {
        return this.db[this.storeName];
    }

    // #region get item
    async getItem(id) {
        if (typeof id === 'number') return await this.getItemByIndex({
            id: id
        });
        if (typeof id === 'object' && id !== null) return await this.getItemByIndex(id);
        return undefined;
    }

    async getItemByIndex(indexObject) {
        if (typeof indexObject !== 'object' || indexObject === null) return undefined;
        try {
            return await db[this.storeName].get(indexObject);
        } catch (error) {
            console.error(`error geting item by object ${this.storeName} id:${indexObject}`);
            console.log(error);
            throw error;
        }
    }

    async getItemById(id) {
        if (typeof id !== 'number' && id < 0) return undefined;
        try {
            await db[this.storeName].get(id);
        } catch (error) {
            console.error(`error geting item ${this.storeName} id:${id}`);
            console.log(error);
            throw error;
        }
    }
    // #endregion get item

    // #region get list
    async get(query) {
        try {
            let os = this.store;
            if (!query) {
                return await os.toArray();
            }
            if (query.searchText) {
                query.searchText = query.searchText.toLowerCase();
                os = os.filter(i => i.searchField.indexOf(query.searchText) > -1);
            }
            if (query.order) {
                if (typeof query.order === 'string' || query.order.property)
                    os = os.orderBy(query.order.property || query.order);
                if (query.order.desc)
                    os = os.reverse();
            }
            if(query.where) {
                if(!Array.isArray(query.where)) query.where = [query.where];
                query.where.forEach(where => {
                    if(where.property)
                        os = os.where(where.property)[where.operation](where.value);
                    else 
                        os = os.where(where);
                });
            }
            if (query.skip > 0) {
                os = os.offset(query.take);
            }
            if (query.take > 0) {
                os = os.limit(query.take);
            }

            return await os.toArray();
        } catch (error) {
            throw error;
        }
    }

    async count(query) {
        try {
            let os = this.store;
            if (!query) {
                return await os.count();
            }
            if (query.searchText) {
                query.searchText = query.searchText.toLowerCase();
                os = os.filter(i => i.searchField.indexOf(query.searchText) > -1);
            }

            return await os.count();
        } catch (error) {
            throw error;
        }
    };
    // #endregion get list

    // #region save
    async save(item) {
        let f = '';
        if (!item.id || item.id <= 0) {
            delete item.id;
            f = 'add';
        } else {
            f = 'put';
        }

        try {
            await db[this.storeName][f](item);
            return item.id;
        } catch (error) {
            console.error(`error saving ${this.storeName} id: ${item.id}`);
            console.error(error);
            throw error;
        }
    }
    // #endregion save

    // #region delete
    async delete(id) {
        try {
            await this.store.delete(id);
            return true;
        } catch (error) {
            throw error;
        }
    };

    async deleteAll() {
        try {
            await this.store.clear();
            return true;
        } catch (error) {
            throw error;
        }
    };
    // #endregion delete
}