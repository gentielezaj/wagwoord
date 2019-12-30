import {
    uuidv4, getCreditCardImage
} from '../../../shared/services/core/helper.service';

export default {
    computed: {
        creditCardForms() {
            return this.forms.filter(f => f.type == 'creditcard');
        }
    },
    methods: {
        getCreditcardDropDownModel(event) {
            return {
                valueField: 'name',
                info: item => {
                    console.log(item.cardType);
                    return `<img src="${chrome.runtime.getURL(getCreditCardImage(item.cardType))}">` + " **** " + item.cardNumber.substring(item.cardNumber.length - 4) + ` | exp: ${item.expiredMonth} / ${(item.expiredYear + '').substring(2)}`;
                },
                data: this.$appData.creditcards
            };
        },
        async creditcardFormsInit(submittedResponse) {
            if (submittedResponse && submittedResponse.creditcard) {
                this.openCreditcardDialog(Object.assign({}, submittedResponse.creditcard));
                submittedResponse.creditCard = undefined;
            }

            if (this.creditCardForms.length && !this.$appData.creditcards) {
                const creditcards = await this.$chrome.get('creditcards');
                this.$appData.setData('creditcards', creditcards);
                console.log(this.$appData.creditcards);
            }

            this.creditCardForms.forEach(f => {
                let form = f.formElement;
                if (f.formElement.getAttribute('wagwoord-form-id')) return;
                const formId = uuidv4();
                form.setAttribute('wagwoord-form-id', formId);
                f.id = formId;
                form.setAttribute('autocomplete', 'off');
                form.setAttribute('wagwoord-form-type', 'creditcard');

                this.setCreditCardOnClickOpenPopUp(f.cvcElement, 'cc-csc');
                this.setCreditCardOnClickOpenPopUp(f.nameElement, 'cc-name');
                this.setCreditCardOnClickOpenPopUp(f.numberElement, 'cc-number');
                this.setCreditCardOnClickOpenPopUp(f.expMonthElement, 'cc-exp-month');
                this.setCreditCardOnClickOpenPopUp(f.expYearElment, 'cc-exp-year');
                this.setCreditCardOnClickOpenPopUp(f.expElement, 'cc-exp');
                this.setCreditCardOnClickOpenPopUp(f.typeElement, 'cc-type');

                form.addEventListener('submit', event => {
                    this.onCreditCeditcardFormSubmit(event);
                });

                this.setCreditCardInputValue(f);
            });
        },
        openCreditcardDialog(password) {
            this.openDialog({
                title: password.action == 'update' ? 'Update password' : 'Save password',
                message: password.model.username || '[No username]',
                model: password.model,
                actions: [{
                        value: 'save',
                        class: 'success',
                        clickData: 'save',
                        method: 'dialogCreditcard'
                    },
                    {
                        value: 'reject',
                        class: 'error',
                        clickData: 'reject',
                        method: 'dialogCreditcard'
                    }
                ]
            });
        },
        async onCreditCeditcardFormSubmit(event) {
            const formId = event.target.getAttribute('wagwoord-form-id');
            if (!formId) return;
            const form = this.forms.find(f => f.id == formId);
            if (!form.cvcElement.value) return;
            console.log(`wagwoord form values: creditcard: `);

            const model = {
                creditcard: {
                    cvv: form.cvcElement.value,
                    name: form.nameElement.value,
                    cardNumber: form.numberElement.value,
                    expiredMonth: form.expMonthElement.value,
                    expiredYear: form.expYearElment.value
                }
            };

            const response = await this.$chrome.formSubmittion("creditcard", JSON.stringify(model));
            if (response.hasAction && response.creditcard) {
                this.openCreditcardDialog(response.creditcard);
            }
        },
        async dialogCreditcard(model, type) {
            if (!type || type == 'reject') {
                await this.$chrome.storage.removeItem('submitted');
            }

            this.$chrome.post({
                creditcard: model
            });
        },
        setCreditCardOnClickOpenPopUp(element, type) {
            if (!element) return;

            if (type) {
                element.setAttribute('wagwood-input-type', type);
            }

            element.addEventListener('click', event => {
                this.openDropdown(event, this.getCreditcardDropDownModel());
            });

            element.setAttribute('autocomplete', 'off');

            if (this.$appData.creditcards.length) {
                element.addEventListener('keyup', event => {
                    if (event.target.getAttribute('wagwood-input-type') != 'cc-csc') {
                        let data = this.$appData.creditcards;
                        if (event.target.value) {
                            data = this.$appData.creditcards.filter(p => p.name.startsWith(event.target.value.toLowerCase()));
                        }
                        this.inputDropdownData.data = data && data.length ? data : this.$appData.creditcards;
                    } else {
                        if (event.target.value) {
                            this.closeDropdown();
                        } else {
                            this.openDropdown(event, this.getCreditcardDropDownModel());
                        }
                    }
                });
            }
            element.addEventListener('blur', event => {
                const selectedElement = event.relatedTarget;
                if (!selectedElement || !selectedElement.getAttribute('wagwoord-app-field'));
                else if (selectedElement.getAttribute('wagwoord-data') == 'open-settings') {
                    this.goToSettings('credit-card');
                } else {
                    const form = this.creditCardForms.find(f => f.id == event.target.form.getAttribute('wagwoord-form-id'));
                    const passwordItem = this.$appData.creditcards.find(p => p.id == selectedElement.id);
                    this.setCreditCardInputValue(form, passwordItem, event.target);
                }
                this.closeDropdown(event);
            });
        },
        setCreditCardInputValue(form, item, element) {
            if (!item && this.$appData.creditcards.length) {
                item = this.$appData.creditcards[0];
            }

            if (!item || !form) return;

            this.setValueToElement(form.cvcElement, item.cvv, false);
            this.setValueToElement(form.nameElement, item.name, false);
            this.setValueToElement(form.numberElement, item.cardNumber, false);
            this.setCostumInputValue(form.expMonthElement, item.expiredMonth, false);
            this.setCostumInputValue(form.expYearElment, item.expiredYear, false);
            this.setValueToElement(form.expElement, `${item.expMonthElement}/${item.expiredYear}`, false);
            this.setValueToElement(form.typeElement, item.cardType, false);
        },
        setCostumInputValue(input, value) {
            if(!input) return;
            value = (value + '').length == 1 ? ('0' + value) : (value + '');
            if (input.maxLength == 2 && value.length > 2) {
                value = value.substring(2);
            }

            this.setValueToElement(input, value, true);
        }
    }
};