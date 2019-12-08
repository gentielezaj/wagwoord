import {
    CoreService
} from "./core/core.service";

export default class AddressService extends CoreService {
    constructor() {
        super('address');
    }

    // #region abstract

    async _preSave(item, canUpdate) {
        let oldItem = await this.getItem(item.id);
        if (oldItem && oldItem.serverId) {
            item.serverId = oldItem.serverId;
        }
        let search = [];
        if(item.firstName) search.push(item.firstName);
        if(item.lastName) search.push(item.lastName);
        if(item.city) search.push(item.city);
        if(item.country) search.push(item.country);

        item.searchField = search.join('-');

        return item;
    }

    _isValidModel(item) {
        return true;
    }

    async _convertLocalToServerEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            count: item.count,
            lastModified: item.lastModified,
            id: item.serverId,
            encrypted: item.encrypted,
            firstName: item.firstName,
            lastName: item.lastName,
            birthDate: item.birthDate,
            street: item.street,
            secundStreet: item.secundStreet,
            city: item.city,
            state: item.state,
            country: item.country,
            username: item.username,
            postalCode: item.postalCode,
            organization: item.organization,
            phone: item.phone
        };

        if (!result.encrypted) {
            const street = await this.encryption.tryEncrypt(result.street);
            const secundStreet = await this.encryption.tryEncrypt(result.secundStreet);
            if (street && secundStreet && street.encrypted && secundStreet.encrypted) {
                result.encrypted = street.encrypted;
                result.street = street.value;
                result.secundStreet = secundStreet.value;
            }
        }

        return result;
    }

    async _convertServerToLocalEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            count: item.count,
            lastModified: item.lastModified,
            serverId: item.id,
            encrypted: item.encrypted,
            firstName: item.firstName,
            lastName: item.lastName,
            birthDate: item.birthDate,
            street: item.street,
            secundStreet: item.secundStreet,
            city: item.city,
            state: item.state,
            country: item.country,
            username: item.username,
            postalCode: item.postalCode,
            organization: item.organization,
            phone: item.phone
        };

        if (!result.encrypted) {
            const street = await this.encryption.tryDecrypt(result.street);
            const secundStreet = await this.encryption.tryDecrypt(result.secundStreet);
            if (street && secundStreet && street.encrypted && secundStreet.encrypted) {
                result.encrypted = !street.decrypted;
                result.street = street.value;
                result.secundStreet = secundStreet.value;
            }
        }

        return result;
    }
    // #endregion abstract
}