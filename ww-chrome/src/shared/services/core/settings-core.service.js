import { CoreService } from "./core.service";

export default class SettingsCoreService extends CoreService {
    constructor(setting) {
        super('settings');
        this.settingsName = setting;
    }
    // #region get
    async get() {
        return await this.db.getItem({
            name: this.settingsName
        });
    }

    getSaveItem(item) {
        return this.get();
    }
    // #endregion get
    async save(model, onSaveItem, notlastModified, ignoreServer) {
        model.name = this.settingsName;
        model.synced = true;
        return await super.save(model, onSaveItem, notlastModified, ignoreServer);
    }

    // #region converters
    async _convertServerToLocalEntity(item) {
        if(!item) return undefined;
        if(item.encrypted) {
            let dval = await this.encryption.decrypt(item.value);
            item.encrypted = false;
            item.value = dval;
        }

        let model = JSON.parse(item.value);
        model.serverId = this.util.copy(item.id);
        model.name = item.name;
        model.encrypted = item.encrypted;
        model.lastModified = item.lastModified;
        model.synced = true;
        return model;
    }

    async _convertLocalToServerEntity (item) {
        let value = JSON.stringify(item);
        let encryptedValue = await this.encryption.tryEncrypt(value);
        return {
            id: item.serverId,
            name: item.name,
            lastModified: item.lastModified,
            encrypted: encryptedValue.encrypted,
            value: encryptedValue.value
        };
    };
    // #endregion converters
}