import PasswordService from "./passwords/password.service";
import BlacklistService from "./blacklist/blacklist.service";
import CodeGeneratorService from "./code-generator/code-generator.service";
import CreditCardService from "./credit-card.service";
import AddressService from "./address.service";
import {
    WWUtil
} from '../util/ww-util';
import {
    ProxyService
} from "./proxy.service";

export default class BackgroundService {
    constructor() {
        this.$password = new PasswordService();
        this.$blacklist = new BlacklistService();
        this.$codeGenerator = new CodeGeneratorService();
        this.$creditCards = new CreditCardService();
        this.$addressService = new AddressService();
        this.$proxy = new ProxyService('util');
        this.util = WWUtil;
    }

    async getDataFroDomain(url, submitted) {
        url = this.util.getName(url, true);
        const passwords = await this.$password.get({
            searchText: `${url}-`,
            order: {
                property: 'count',
                desc: true
            }
        });
        const blacklist = await this.$blacklist.getItem({
            name: url
        });
        const passwordSettings = await this.$password.settings.getOrDefults(true);

        return {
            passwords,
            blacklist,
            settings: {
                password: passwordSettings
            },
            submittedResponse: await this.getSubmittedResponse(submitted)
        };
    }

    async getSubmittedResponse(model) {
        if (!model) return undefined;
        if (typeof model === 'string') model = JSON.parse(model);
        let result = {};
        if (model.password) {
            result.password = {};
            const passwordModel = model.password.model ? model.password.model : model.password;
            let password = await this.$password.getItem({
                username: passwordModel.username,
                domain: this.util.getDomain(passwordModel.domain)
            });
            if (password) {
                password.count++;
                this.$password.save(password);
                if (password.password == passwordModel.password) {
                    result.password.action = false;
                } else {
                    result.password.action = 'update';
                }
            } else {
                result.password.action = 'new';
            }
            result.password.model = passwordModel;
        }
        if (model.creditcard) {
            result.creditcard = {};
            const creditcardModel = model.creditcard.model ? model.creditcard.model : model.creditcard;
            result.creditcard.model = creditcardModel;
            let creditcard = await this.$creditCards.getItem({
                cardNumber: creditcardModel.cardNumber
            });
            if (creditcard) {
                creditcard.count++;
                this.$creditCards.save(creditcard);
                if (creditcard.name != creditcardModel.name || creditcard.cvv != creditcardModel.cvv || creditcard.expiredMonth != creditcardModel.expiredMonth || creditcard.expiredYear != creditcardModel.expiredYear) {
                    result.creditcard.action = 'update';
                }
            } else {
                result.creditcard.action = 'new';
            }
        }
        if (model.address) {
            result.address = {};
            const addressModel = model.address.model ? model.address.model : model.address;
            result.address.model = addressModel;

            if (addressModel.name) {
                if (addressModel.name.trim().indexOf(' ') > -1) {
                    let splitName = addressModel.name.trim().split(' ');
                    addressModel.firstName = splitName[0];
                    addressModel.lastName = splitName[1];
                } else addressModel.firstName = addressModel.name;
            }
            if (addressModel.phone && !addressModel.callingCode) {
                // TODO: check calling code
            }

            let searchModel = {};
            if (addressModel.firstName) {
                searchModel.firstName = addressModel.firstName;
            }
            if (addressModel.lastName) {
                searchModel.lastName = addressModel.lastName;
            }
            if (addressModel.username) {
                searchModel.username = addressModel.username;
            }
            if (addressModel.phone) {
                searchModel.phone = addressModel.phone;
            }
            if (addressModel.street) {
                searchModel.street = addressModel.street;
            }

            let address = await this.$addressService.getItem(searchModel);
            if (!address) {
                result.address.action = 'new';
            } else {
                address.count++;
                this.$addressService.save(address);
            }
        }

        result.hasAction = (result.password && result.password.action) || (result.creditcard && result.creditcard.action) || (result.address && result.address.action);
        return result;
    }

    // #region save
    async save(model) {
        if (!model) return false;
        if (model.password) {
            model.password.name = model.password.name || model.password.domain;
            model.password.synced = true;
            this.$password.save(model.password).then();
        }
        if (model.creditcard) {
            model.creditcard.synced = true;
            this.$creditCards.save(model.creditcard).then();
        }
        if (model.address) {
            model.address.synced = true;
            this.$addressService.save(model.address).then();
        }

        return false;
    }
    // #endregion save

    async checkServer() {
        const response = await this.$proxy.checkProxy();
        console.log('is connection set ok: ' + response);
        return response;
    }

    async sync() {
        if (await this.checkServer()) {
            await this.$password.sync();
            await this.$password.settings.sync();
            await this.$blacklist.sync();
            await this.$codeGenerator.sync();
            await this.$addressService.sync();
            await this.$creditCards.sync();
        }
    }
}