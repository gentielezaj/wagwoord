import {
    CoreService
} from "../core/core.service";

export default class BlacklistService extends CoreService {
    constructor() {
        super('blacklist');
    }

    async checkUrl(url) {
        url = this.util.getName(url, true);

        return await this.getItem({
            name: url
        });
    }

    async toggle(domain) {
        domain = this.util.getName(domain, true);

        const oldPasseord = await this.getItem({
            name: domain
        });

        if (oldPasseord) {
            await this.delete(oldPasseord.id);
            return false;
        }

        return await this.save({
            name: domain,
            password: true,
            address: true,
            creditCard: true,
            codeGenerator: true
        });
    }

    // #region abstract
    async _preSave(item, canUpdate) {
        item.name = this.util.getName(item.name, true);
        item.domain = this.util.getDomain(item.domain || item.name);

        item.password = item.password ? true : false;
        item.address = item.address ? true : false;
        item.creditCard = item.creditCard ? true : false;
        item.codeGenerator = item.codeGenerator ? true : false;

        const oldItem = await this._getOldItem(item, {
            name: item.name
        });

        if (!canUpdate && oldItem && oldItem.id != item.id) {
            // eslint-disable-next-line no-throw-literal
            throw "item-exists";
        }

        if (oldItem && oldItem.id) {
            item.id = oldItem.id;
        }

        if (oldItem && oldItem.serverId) {
            item.serverId = oldItem.serverId;
        }

        item.searchField = item.name.toLowerCase();

        return item;
    }

    _isValidModel(item) {
        return item.name;
    }

    // #endregion abstract
}