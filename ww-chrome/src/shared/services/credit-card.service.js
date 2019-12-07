import {
    CoreService
} from "./core/core.service";

export default class CreditCardService extends CoreService {
    constructor() {
        super('creditcard');
    }

    // #region abstract
    async _preSave(item, canUpdate) {
        if (!item.cardNumber || !item.name || !item.expiredMonth || !item.expiredYear) {
            // eslint-disable-next-line no-throw-literal
            throw 'invalide credit card model';
        }

        let oldItem = await this.getItem(item.id);

        if (!oldItem) {
            oldItem = await this.getItem({
                cardNumber: item.cardNumber
            });

            if (oldItem && !canUpdate) {
                // eslint-disable-next-line no-throw-literal
                throw "item-exists";
            }
        }

        if (oldItem && oldItem.id) {
            item.id = oldItem.id;
        }

        if (oldItem && oldItem.serverId) {
            item.serverId = oldItem.serverId;
        }

        if(item.nfc) item.nfc = true;
        if(!item.nfc) item.nfc = false;

        let searchCardType = item.cardType ? '-' + item.cardType.toLowerCase() : '';
        let searchBank = item.bank ? '-' + item.bank.toLowerCase() : '';
        item.searchField = `${item.name.toLowerCase()}${searchCardType}${searchBank}`;
        if (item.bank) {
            item.searchField += "-" + item.bank.toLowerCase();
        }

        return item;
    }

    _isValidModel(item) {
        return item.cardNumber && item.name && item.expiredMonth && item.expiredYear;
    }

    async _convertLocalToServerEntity(item) {
        if (item.hasOwnProperty('$$hashKey')) delete item.$$hashKey;
        let result = {
            count: item.count,
            lastModified: item.lastModified,
            id: item.serverId,
            encrypted: item.encrypted,
            name: item.name,
            cardType: item.cardType,
            expiredMonth: item.expiredMonth,
            expiredYear: item.expiredYear,
            cardNumber: item.cardNumber,
            cvv: item.cvv,
            bank: item.bank,
            pin: item.pin,
            nfc: item.nfc
        };

        if (!result.encrypted) {
            const ep = await this.encryption.tryEncrypt(result.cardNumber);
            const cvv = await this.encryption.tryEncrypt(result.cvv);
            const pin = await this.encryption.tryEncrypt(result.pin);
            if (ep && cvv && ep.encrypted && cvv.encrypted && pin && pin.encrypted) {
                result.encrypted = ep.encrypted;
                result.secret = ep.value;
                result.cvv = cvv.value;
                result.pin = pin.value;
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
            name: item.name,
            cardType: item.cardType,
            expiredMonth: item.expiredMonth,
            expiredYear: item.expiredYear,
            cardNumber: item.cardNumber,
            cvv: item.cvv,
            bank: item.bank,
            pin: item.pin,
            nfc: item.nfc,
            synced: true
        };

        if (!result.encrypted) {
            const ep = await this.encryption.tryDecrypt(result.cardNumber);
            const cvv = await this.encryption.tryDecrypt(result.cvv);
            const pin = await this.encryption.tryDecrypt(result.pin);
            if (ep && cvv && ep.decrypted && cvv.decrypted && pin && pin.decrypted) {
                result.encrypted = !ep.decrypted;
                result.secret = ep.value;
                result.cvv = cvv.value;
                result.pin = pin.value;
            }
        }

        return result;
    }
    // #endregion abstract
}