import {
    ProxyService
} from '../proxy.service';
import EncryptionService from '../encryprion.service';

import DB from '../database/db.service';
import {
    copy
} from './helper.service';

export class CoreService {
    get deletedUnsyncStorageKey() {
        return `${this.entityName}deletedUnsyncStorageKey`;
    }

    get lastModifiedStorageKey() {
        return `${this.entityName}lastModifiedStorageKey`;
    }

    constructor(entityName) {
        this.proxy = new ProxyService(entityName);
        this.db = new DB(entityName);
        this.entityName = entityName;
        this.encryption = new EncryptionService();
    }

    // #region get
    async get(query) {
        return await this.db.get(query);
    }

    async list(query) {
        let list = await this.get(query);
        let count = await this.db.count(query);
        return {
            list,
            count
        };
    }

    async getItem(key) {
        return await this.db.getItem(key);
    }

    async getSaveItem(item) {
        return await this.get();
    }
    // #endregion get

    // #region delete
    async delete (id, dontUpdateServer) {
        const item = await this.getItem(id);
        if (!item) return true;
        const deleted = await this.db.delete(id);
        if (deleted && item.serverId && !dontUpdateServer && !(await this.proxy.delete(item.serverId)).success) {
            let unsyced = localStorage.getItem(this.deletedUnsyncStorageKey);
            unsyced = unsyced ? unsyced.split(',') : [];
            unsyced.push(item.serverId);
            localStorage.setItem(this.deletedUnsyncStorageKey, unsyced.join(','));
        }

        return deleted;
    };

    async deleteAll () {
        if ((await this.proxy.deleteAll()).success)
            return await this.db.deleteAll();

        return false;
    };

    async syncDeleted () {
        let deleted = localStorage.getItem(this.deletedUnsyncStorageKey);
        if (!deleted || !deleted.length) return true;
        let result = await this.proxy.delete(deleted);
        if (result.success === true) {
            localStorage.removeItem(this.deletedUnsyncStorageKey);
        }
        return result.success;
    };
    // #endregion delete

    // #region save
    async save(model, onSaveItem, notlastModified, ignoreServer) {
        return await this._saveArray(model, onSaveItem, notlastModified, ignoreServer);
    }

    async saveOrUpdate(model, onSaveItem, notlastModified, ignoreServer) {
        return await this._saveArray(model, onSaveItem, notlastModified, ignoreServer, true);
    }

    async _saveArray(model, onSaveItem, notlastModified, ignoreServer, canUpdate) {
        if(!Array.isArray(model)) {
            return await this._coreSave(model, onSaveItem, notlastModified, ignoreServer, canUpdate);
        }

        let results = [];
        for (let i = 0; i < model.length; i++) {
            results.push(await this._coreSave(model[i], onSaveItem, notlastModified, ignoreServer, canUpdate));
        }

        return results;
    }

    async _coreSave(model, onSaveItem, notlastModified, ignoreServer, canUpdate) {
        if (!this._isValidModel(model)) return false;

        if (typeof this._preSave === 'function') {
            model = await this._preSave(model, canUpdate);
        }

        let old = await this.getItem(model.id);
        if (old && old.serverId) {
            model.serverId = old.serverId;
        }

        model.synced = model.synced || false;
        if (!notlastModified || !model.lastModified) model.lastModified = new Date().getTime();

        model.id = await this.db.save(model);
        if (model.id && !ignoreServer && model.synced === true && await this.proxy.isSet()) {
            await this.syncServer(copy(model));
        }
        if (typeof onSaveItem === 'function') {
            onSaveItem(model);
        }

        return model.id;
    }

    async _saveServerItemsLocaly (response, onSaveItem) {
        if (response.success === true) {
            if (Array.isArray(response.data))
                for (let i in response.data) {
                    await this._saveServerItemLocaly(response.data[i], onSaveItem);
                }
            else await this._saveServerItemLocaly(response.data, onSaveItem);

            return true;
        }
        return false;
    };

    async _saveServerItemLocaly(item, onSaveItem) {
        if(!item) return item;
        if (item.deleted == 1) {
            return await this.delete({
                serverId: item.id
            }, true);
        }

        item = await this._convertServerToLocalEntity(item);

        return await this.saveOrUpdate(item, onSaveItem, true, true);
    };

    _isValidModel(item) {
        return true;
    }
    // #endregion save

    // #region converters
    async _convertServerToLocalEntity(item) {
        item.serverId = copy(item.id);
        item.synced = true;
        delete item.id;

        return item;
    }

    async _convertLocalToServerEntity (item) {
        item.id = copy(item.serverId);
        delete item.serverId;
        delete item.synced;

        return item;
    };
    // #endregion converters

    // #region sever sync
    async sync () {
        const deleted = await this.syncDeleted();
        const local = await this.syncFromServer();
        const server = await this.syncServer();
        // eslint-disable-next-line no-unneeded-ternary
        const result = deleted && local && server ? true : false;
        if (result) localStorage.setItem(this.lastModifiedStorageKey, new Date().getTime());
    };

    async syncFromServer () {
        let item = (await this.db.store.orderBy('lastModified').reverse().first()) || {};
        let localStorageLastModified = localStorage.getItem(this.lastModifiedStorageKey);
        let lastModified = item.lastModified > localStorageLastModified ? item.lastModified : localStorageLastModified;
        if(localStorageLastModified == "-1") lastModified = 0;
        const data = await this.proxy.patch(lastModified || 0);
        const result = await this._saveServerItemsLocaly(data);
        return result;
    };

    async syncServer (items, onSaveItem) {
        if (!items) {
            var res = await this.proxy.patch();
            if (!res.success) {
                return false;
            }

            items = await this.db.store.filter(p => p.lastModified > res.data && p.synced).toArray();
        } else if (items === 'all') {
            items = await this.db.store.toArray();
        } else if (!Array.isArray(items)) {
            items = [items];
        }

        if (!items.length) return true;

        for (let i = 0; i < items.length; i++) {
            items[i] = await this._convertLocalToServerEntity(items[i]);
        }

        var result = await this.proxy.post(items);
        if (result.success && !result.unsetProxy) {
            await this._saveServerItemsLocaly(result.unsetProxy ? items : result, onSaveItem);
        }

        return result.success;
    };
    // #endregion sever sync
}