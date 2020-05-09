import {
    ProxyService
} from '../proxy.service';
import EncryptionService from '../encryprion.service';

import DB from '../database/db.service';

import {
    WWUtil
} from '../../util/ww-util';
import ChromeService from '../chrome.service';

export class CoreService {
    constructor(entityName) {
        this.proxy = new ProxyService(entityName);
        this.db = new DB(entityName);
        this.entityName = entityName;
        this.encryption = new EncryptionService();
        this.chromeService = new ChromeService();
        this.util = WWUtil;
    }

    get deletedUnsyncStorageKey() {
        return `${this.entityName}deletedUnsyncStorageKey`;
    }

    get lastModifiedStorageKey() {
        return `${this.entityName}lastModifiedStorageKey`;
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

    // #endregion get

    // #region delete
    async delete(id, dontUpdateServer) {
        const item = await this.getItem(id);
        if (!item) return true;
        const deleted = await this.db.delete(item.id);
        if (deleted && item.serverId && !dontUpdateServer && !(await this.proxy.delete({
                params: item.serverId
            })).success) {
            let unsyced = await this.chromeService.get(this.deletedUnsyncStorageKey);
            unsyced = unsyced ? unsyced.split(',') : [];
            unsyced.push(item.serverId);
            await this.chromeService.set(this.deletedUnsyncStorageKey, unsyced.join(','));
        }

        return deleted;
    };

    async deleteAll() {
        if ((await this.proxy.deleteAll()).success)
            return await this.db.deleteAll();

        return false;
    };

    async _syncDeleted() {
        let deleted = await this.chromeService.get(this.deletedUnsyncStorageKey);
        if (!deleted || !deleted.length) return true;
        let result = await this.proxy.delete({
            params: deleted
        });
        if (result.success === true) {
            await this.chromeService.remove(this.deletedUnsyncStorageKey);
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

    async _getOldItem(item, uniqeQuery) {
        let oldItem;
        if (item.serverId) {
            oldItem = await this.getItem({
                serverId: item.serverId
            });
        } else if (item.id) {
            oldItem = await this.getItem(item.id);
        } else if (uniqeQuery) {
            oldItem = await this.getItem(uniqeQuery);
        }

        return oldItem;
    }

    async _saveArray(model, onSaveItem, notlastModified, ignoreServer, canUpdate) {
        let isArrayModel = true;
        if (!Array.isArray(model)) {
            isArrayModel = false;
            model = [model];
        }

        const isProxySet = await this.proxy.isSet();
        let results = [];
        for (let i = 0; i < model.length; i++) {
            let item = model[i];
            if (!this._isValidModel(item)) {
                return item;
            }

            if (!notlastModified || !item.lastModified) item.lastModified = new Date().getTime();

            if (typeof this._preSave === 'function') {
                item = await this._preSave(item, canUpdate);
            }

            if (isProxySet && !ignoreServer && item.synced) results.push(this._syncServer(item));
            else results.push(await this._coreSave(model[i], onSaveItem, notlastModified, true, canUpdate));
        }

        if (isArrayModel) return results;
        return results && results.length ? results[0] : 0;
    }

    async _coreSave(model, onSaveItem, notlastModified, ignoreServer, canUpdate) {
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
            await this._syncServer(this.util.copy(model));
        }
        if (typeof onSaveItem === 'function') {
            onSaveItem(model);
        }

        return model.id;
    }

    async _saveServerItemsLocaly(response, onSaveItem) {
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
        if (!item) return item;
        if (item.deleted == 1) {
            return await this.delete({
                serverId: item.id
            }, true);
        }

        item = await this._convertServerToLocalEntity(item);

        return await this._saveArray(item, onSaveItem, true, true, true);
    };

    _isValidModel(item) {
        return true;
    }
    // #endregion save

    // #region converters
    async _convertServerToLocalEntity(item) {
        item.serverId = this.util.copy(item.id);
        item.id = item.localId;
        item.synced = true;

        return item;
    }

    async _convertLocalToServerEntity(item) {
        item.localId = this.util.copy(item.id);
        item.id = this.util.copy(item.serverId);
        if (item.hasOwnProperty('synced')) delete item.synced;

        return item;
    };
    // #endregion converters

    // #region sever sync
    async sync(forece) {
        const deleted = await this._syncDeleted();
        const local = await this._syncFromServer(forece);
        const server = await this._syncServer(forece ? 'all' : undefined);
        // eslint-disable-next-line no-unneeded-ternary
        const result = deleted && local && server ? true : false;
        if (result) await this.chromeService.set(this.lastModifiedStorageKey, new Date().getTime());
    };

    async _syncFromServer(forece) {
        let item = (await this.db.store.orderBy('lastModified').reverse().first()) || {};
        let localStorageLastModified = (await this.chromeService.get(this.lastModifiedStorageKey)) || 0;
        let lastModified = item.lastModified > (localStorageLastModified || 0) ? item.lastModified : localStorageLastModified;
        if (localStorageLastModified == "-1" || forece) lastModified = 0;
        const data = await this.proxy.patch({
            params: lastModified || 0
        });
        const result = await this._saveServerItemsLocaly(data);
        return result;
    };

    async _syncServer(items, onSaveItem) {
        if (!items) {
            var res = await this.proxy.get({
                action: 'lastModified'
            });
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

        var result = await this.proxy.post({
            data: items
        });
        if (result.success && !result.unsetProxy) {
            await this._saveServerItemsLocaly(result.unsetProxy ? items : result, onSaveItem);
        }

        return result.success;
    };
    // #endregion sever sync
}