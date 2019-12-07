import core from './core.store.js';
import { copy } from '../services/core/helper.service'
import creditcardService from '../services/credit-card.service';
const store = {
    getters: {
        creditCardType: state => cardNumber => {
            if(!cardNumber && !cardNumber.length) return undefined;

            cardNumber = copy(cardNumber).replace(/( )/g, '');
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
                    console.log('card is: ' + key);
                    return key;
                }
            }

            return undefined;
        },

        creditCardIcon: (state, getters) => card => {
            if (!card) {
                return 'icon-card';
            }

            if (/^[0-9]+/g.test(card)) {
                card = getters.creditCardType(card);
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
    }
};
export default core(creditcardService, store);