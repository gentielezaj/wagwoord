import PasswordService from "./passwords/password.service";
import BlacklistService from "./blacklist/blacklist.service";
import CodeGeneratorService from "./code-generator/code-generator.service";
import CreditCardService from "./credit-card.service";
import AddressService from "./address.service";
import {
    WWUtil
} from '../util/ww-util';
import {
    AuthService
} from "./auth/auth.service";
import AppService from "./app.service";

export default class BackgroundService {
    constructor() {
        this.$password = new PasswordService();
        this.$blacklist = new BlacklistService();
        this.$codeGenerator = new CodeGeneratorService();
        this.$creditCards = new CreditCardService();
        this.$addressService = new AddressService();
        this.$authService = new AuthService();
        this.$app = new AppService();
        this.services = {
            "password": this.$password,
            "blacklist": this.$blacklist,
            "codeGenerator": this.$codeGenerator,
            "creditCards": this.$creditCards,
            "address": this.$addressService,
            "auth": this.$authService,
            "app": this.$app
        };
        this.util = WWUtil;
    }

    get serviceList() {
        let list = [];
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                list.push(key);
            }
        }

        return list;
    }

    async resolve(service, action, params) {
        try {
            let value;
            if (service == 'background') {
                if (params == undefined) {
                    value = await this[action]();
                } else if (Array.isArray(params)) {
                    await this[action].apply(null, params);
                } else {
                    value = await this[action](...params);
                }
            } else if (service == 'auth' && action == 'login') {
                value = await this.login(...params);
            } else {
                if (params == undefined) {
                    value = await this.services[service][action]();
                } else if (Array.isArray(params)) {
                    value = await this.services[service][action].apply(this.services[service], params);
                } else {
                    value = await this.services[service][action](...params);
                }
            }

            return {
                data: value,
                success: true
            };
        } catch (error) {
            console.error(error);
            return {
                error: error,
                success: false
            };
        }
    }

    async login(data) {
        try {
            if (data.domain) {
                let credetialsFor = await this.$authService.credentialsFor(data.encryptionKey);
                if (credetialsFor != 'change' && credetialsFor != 'login') return false;

                if (credetialsFor == 'change') {
                    for (let i = 0; i < this.serviceList.length; i++) {
                        if (typeof this.services[this.serviceList[i]]._syncFromServer == 'function') {
                            await this.services[this.serviceList[i]]._syncFromServer();
                        }
                    }
                }

                const serverStatus = await this.$authService.login(data.domain, data.encryptionKey, data.encryptLocal, credetialsFor);
                await this.checkServer(false);
                if (!serverStatus) return false;

                for (let i = 0; i < this.serviceList.length; i++) {
                    if (typeof this.services[this.serviceList[i]]._syncServer == 'function') {
                        await this.services[this.serviceList[i]]._syncServer();
                    }
                }
            } else {
                const value = await this.$authService.login(data.domain, data.encryptionKey, data.encryptLocal);
                await this.checkServer(true);
                return value;
            }
        } catch (error) {
            throw error;
        }

        return true;
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

    async checkServer(force = true) {
        const response = await this.$authService.getProxyStatus(force);
        if (response == 'error') chrome.browserAction.setIcon({
            path: "assets/logo/logo_128_square_waring.png"
        });
        else chrome.browserAction.setIcon({
            path: "assets/logo/logo_128_square.png"
        });

        return response == 'ok';
    }

    async sync() {
        if (await this.checkServer()) {
            for (let i = 0; i < this.serviceList.length; i++) {
                if (typeof this.services[this.serviceList[i]].sync == 'function') {
                    await this.services[this.serviceList[i]].sync();
                }
            }
        }
    }
}