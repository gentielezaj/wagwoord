import core from './core.store.js';
import { getCreditCardImage, getCreditcardType } from '../services/core/helper.service';
import creditcardService from '../services/credit-card.service';
const store = {
    getters: {
        creditCardType: state => cardNumber => {
            return getCreditcardType(cardNumber);
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
        },
        creditCardImage: (state, getters) => card => {
            return getCreditCardImage(card);
        }
    }
};
export default core(creditcardService, store);