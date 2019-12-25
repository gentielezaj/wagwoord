import {
    CoreService
} from "./core/core.service";

export default class AddressService extends CoreService {
    constructor() {
        super('address');
    }

    // #region abstract

    async _preSave(item, canUpdate) {
        let search = [];
        if (item.firstName) search.push(item.firstName);
        if (item.lastName) search.push(item.lastName);
        if (item.city) search.push(item.city);
        if (item.country) search.push(item.country);
        item.searchField = search.join('-');

        let oldItem;
        if (item.id) {
            oldItem = await this.getItem(item.id);
        } else if(item.serverId) {
            oldItem = await this.getItem({
                serverId: item.serverId
            });
        }

        if(oldItem === undefined) {
            oldItem = await this.getItem({
                searchField: item.searchField
            });
        }
        
        if (oldItem && oldItem.serverId) {
            item.serverId = oldItem.serverId;
        }
        if (oldItem && oldItem.id) {
            item.id = oldItem.id;
        }

        item.encrypted = item.encrypted || false;
        item.count = item.count || 0;

        return item;
    }

    _isValidModel(item) {
        return true;
    }

    async _convertLocalToServerEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            count: item.count || 0,
            lastModified: item.lastModified,
            id: item.serverId,
            localId: item.id,
            encrypted: item.encrypted || false,
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
            phone: item.phone,
            callingCode: item.callingCode,
            region: item.region,
            subregion: item.subregion,
            countryAlpha2Code: item.countryAlpha2Code,
            countryAlpha3Code: item.countryAlpha3Code
        };

        if (!result.encrypted) {
            const street = await this.encryption.tryEncrypt(result.street);
            const secundStreet = await this.encryption.tryEncrypt(result.secundStreet);
            if (street && secundStreet && street.encrypted && secundStreet.encrypted) {
                result.encrypted = street.encrypted || false;
                result.street = street.value;
                result.secundStreet = secundStreet.value;
            }
        }

        return result;
    }

    async _convertServerToLocalEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            count: item.count || 0,
            lastModified: item.lastModified,
            serverId: item.id,
            encrypted: item.encrypted || false,
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
            phone: item.phone,
            id: item.localId,
            synced: true,
            callingCode: item.callingCode,
            region: item.region,
            subregion: item.subregion,
            countryAlpha2Code: item.countryAlpha2Code,
            countryAlpha3Code: item.countryAlpha3Code
        };

        if (result.encrypted) {
            const street = await this.encryption.tryDecrypt(result.street);
            const secundStreet = await this.encryption.tryDecrypt(result.secundStreet);
            if (street && secundStreet && street.decrypted && secundStreet.decrypted) {
                result.encrypted = !street.decrypted;
                result.street = street.value;
                result.secundStreet = secundStreet.value;
            }
        }

        return result;
    }
    // #endregion abstract
}