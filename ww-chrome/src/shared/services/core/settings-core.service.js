import {
    CoreService
} from "./core.service";

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
        if (!item) return undefined;

        let model = {};
        model.serverId = this.util.copy(item.id);
        model.name = item.name;
        model.encrypted = item.encrypted;
        model.lastModified = item.lastModified;
        if (item.properties) {
            for (let i = 0; i < item.properties.length; i++) {
                const element = item.properties[i];
                model[element.property] = this.convertToType(element, (item.encrypted ? await this.encryption.decrypt(element.value) : element.value));
            }
        }

        model.synced = true;
        model.encrypted = false;
        return model;
    }

    convertToType(property, value) {
        switch (property.type) {
            case 'number': return Number(value);
            case 'boolean': return (value == 'ture');
            default: return value;
        }
    }

    async _saveServerItemLocaly(item, onSaveItem) {
        if(item.name == this.settingsName) super._saveServerItemLocaly(item, onSaveItem);
    };

    async _convertLocalToServerEntity(item) {
        try {
            let model = {
                properties: []
            };
    
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    if(key == 'id') model.serverId = item.id;
                    else if(['name', 'lastModified', 'encrypted', 'id', 'serverId', 'synced'].some(s => s == key)) model[key] = item[key];
                    else {
                        const type = typeof item[key];
                        const encryptedValue = await this.encryption.tryEncrypt(item[key]);
                        model.encrypted = encryptedValue.encrypted;
                        model.properties.push({
                            property: key,
                            value: encryptedValue.value,
                            type
                        });
                    }
                }
            }
    
            return model;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
    // #endregion converters
}