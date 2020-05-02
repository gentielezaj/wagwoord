export class WWUtil {
    static copy(model) {
        if (model === undefined || model === null) {
            return model;
        }

        // return JSON.parse(JSON.stringify(model));

        if (Array.isArray(model)) {
            let arrayResult = [];
            model.forEach(m => arrayResult.push(WWUtil.copy(m)));
            return arrayResult;
        }

        if (typeof model === 'boolean') return Boolean(model);
        if (typeof model === 'number') return Number(model);
        if (Object.prototype.toString.call(model) === '[object Date]') return new Date(model);
        if (typeof model === 'string') return model + '';

        if (typeof model === 'object') {
            let resultObject = {};
            for (const key in model) {
                if (model.hasOwnProperty(key)) {
                    resultObject[key] = WWUtil.copy(model[key]);
                }
            }
            return resultObject;
        }

        if (typeof model === 'function') {
            return function (...params) {
                model(...params);
            };
        }

        return model;
    }

    static clipboard(value) {
        const el = document.createElement('textarea');
        el.value = value;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        return true;
    }

    // #region domain naims
    static getName(domain, min) {
        domain = WWUtil.getDomain(domain, !(/^http(s)?:[/]{2}localhost/.test(domain)));
        domain = domain.replace(/http(s)?:\/\//, '');
        if (!min || !/[a-zA-Z]+/.test(domain)) {
            return domain;
        }
        let splitedDomain = domain.split('.');
        if (splitedDomain.length <= 2) return domain;
        return splitedDomain[splitedDomain.length - 2] + '.' + splitedDomain[splitedDomain.length - 1];
    }

    static getDomain(domain, removePort) {
        if (!domain || domain.startsWith('android:')) return domain;

        if (!(/http(s)?:/.test(domain))) {
            return domain;
        }
        try {
            let url = new URL(domain);
            return url.port && removePort ? url.origin.replace(`:${url.port}`, '') : url.origin;
        } catch (error) {
            throw error;
        }
    }
    // #endregion domain naims

    static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0;
            let v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static getTextFromFile(file) {
        if (!file) return undefined;
        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });
    }

    // #region password generate
    static generatePassword(length, regex, passwordSettings) {
        if(!passwordSettings) return '';
        length = length || passwordSettings.passwordLength;
        let string = "abcdefghijklmnopqrstuvwxyz";
        let numeric = '0123456789';
        let punctuation = passwordSettings.passworIncludeSymbolCharacters ? `(?=.*[${passwordSettings.passwordSymbolCharacters}])` : '';
        let password = "";
        let character = "";
        regex = regex || `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)${punctuation}.{1,}$`;
        regex = new RegExp(regex);
        while (password.length < length * 10) {
            let entity1 = Math.ceil(string.length * Math.random() * Math.random());
            let hold = string.charAt(entity1);
            hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
            character += hold;
            character += numeric.charAt(Math.ceil(numeric.length * Math.random() * Math.random()));
            if (punctuation.length) {
                character += punctuation.charAt(Math.ceil(punctuation.length * Math.random() * Math.random()));
            } else {
                let char = string.charAt(Math.ceil(string.length * Math.random() * Math.random()));
                character += (password.length % 2 == 0) ? char.toLowerCase() : char.toUpperCase();
            }
            password = character;
        }

        password = randomise(password);

        for (let index = length; index < password.length - length; index++) {
            let element = password.substr(index, length);
            if (regex.test(element)) return element;
            if (index + length >= password.length) {
                password = randomise(password);
                index = length;
            }
        }

        return password;

        function randomise(password) {
            return password.split('').sort(function () {
                return 0.5 - Math.random();
            }).join('');
        }
    }
    // #endregion password generate

    // #region credit card
    static getCreditcardType(cardNumber) {
        if (!cardNumber && !cardNumber.length) return undefined;

        cardNumber = WWUtil.copy(cardNumber).replace(/( )/g, '');
        var re = {
            electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
            maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
            dankort: /^(5019)\d+$/,
            interpayment: /^(636)\d+$/,
            unionpay: /^(62|88)\d+$/,
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}$/
        };

        for (var key in re) {
            if (re[key].test(cardNumber)) {
                return key;
            }
        }

        return undefined;
    }

    static getCreditCardIcon(card) {
        if (!card) {
            return 'icon-card';
        }

        if (/^[0-9]+/g.test(card)) {
            card = WWUtil.getCreditcardType(card);
        }
        
        switch (card || '') {
            case 'visa':
            case 'electron':
                return 'icon-cc-visa';
            case 'mastercard':
                return 'icon-cc-mastercard';
            case 'amex':
                return 'icon-cc-amex';
            case 'discover':
                return 'icon-cc-discover';
            default:
                return 'icon-card';
        }
    }

    static getCreditCardImage(card) {
        if (!card) {
            return undefined;
        }

        if (/^[0-9]+/g.test(card)) {
            card = WWUtil.getCreditcardType(card);
        }

        switch (card || '') {
            case 'visa':
            case 'electron':
                return '/assets/icons/credit-cards_visa.png';
            case 'mastercard':
                return `/assets/icons/credit-cards_${card}.png`;
            case 'amex':
                return `/assets/icons/credit-cards_${card}.png`;
            case 'discover':
                return `/assets/icons/credit-cards_${card}.png`;
            case 'maestro':
                return `/assets/icons/credit-cards_${card}.png`;
            default:
                return undefined;
        }
    }
    // #endregion credit card
}