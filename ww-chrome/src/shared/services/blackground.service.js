import PasswordService from "./passwords/password.service";
import BlacklistService from "./blacklist/blacklist.service";
import CodeGeneratorService from "./code-generator/code-generator.service";
import CreditCardService from "./credit-card.service";
import AddressService from "./address.service";

import {
    getName,
    getDomain
} from './core/helper.service';

export default class BackgroundService {
    constructor() {
        this.$password = new PasswordService();
        this.$blacklist = new BlacklistService();
        this.$codeGenerator = new CodeGeneratorService();
        this.$creditCards = new CreditCardService();
        this.$addressService = new AddressService();
    }

    async getDataFroDomain(url, submitted) {
        url = getName(url, true);
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
                domain: getDomain(passwordModel.domain)
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
            var creditcard = await this.$creditCards.getItem({
                cardNumber: creditcardModel.cardNumber
            });
            if(creditcard) {
                creditcard.count++;
                this.$creditCards.save(creditcard);
                if(creditcard.name != creditcardModel.name || creditcard.cvv != creditcardModel.cvv || creditcard.expiredMonth != creditcardModel.expiredMonth || creditcard.expiredYear != creditcardModel.expiredYear) {
                    result.creditcard.action = 'update';
                }
            } else {
                result.creditcard.action = 'new';
            }
        }

        result.hasAction = result.password.action && result.creditcard.action;
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

        return false;
    }
    // #endregion save

    async sync() {
        await this.$password.sync();
        await this.$password.settings.sync();
        await this.$blacklist.sync();
        await this.$codeGenerator.sync();
        await this.$addressService.sync();
        await this.$creditCards.sync();
    }
}