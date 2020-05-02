
export default {
    computed: {
        addressForms() {
            return this.forms.filter(f => f.type == 'address');
        }
    },
    methods: {
        addressFormPropertiesElement(formId) {
            const f = this.addressForms.find(f => f.id == formId);
            if(f) {
                let result = {};
                for(const property in f) {
                    if(property != 'formElement' && property.endsWith('Element') && f.hasOwnProperty(property)) {
                        result[property.replace('Element', '')] = f[property] && typeof f[property] == 'string' ? f[property].trim() : f[property];
                    }
                }
                return result;
            }
        },
        getAddressFromValues(formId) {
            const f = this.addressFormPropertiesElement(formId);
            
            if(f) {
                let result = {};
                for(const property in f) {
                    if(f.hasOwnProperty(property)) {
                        result[property] = f[property].value;
                    }
                }
                return result;
            }
        },
        getAddressDropDownModel(event) {
            return {
                valueField: 'username',
                info: item => {
                    return `${item.firstName} ${item.lastName}, ${item.street}`;
                },
                data: this.$appData.addresses
            };
        },
        async addressFormsInit(submittedResponse) {
            if (submittedResponse && submittedResponse.address) {
                this.openaddressDialog(Object.assign({}, submittedResponse.address));
                submittedResponse.address = undefined;
            }

            if (this.addressForms.length && !this.$appData.addresses) {
                const addresses = await this.$chrome.get('addresses');
                this.$appData.setData('addresses', addresses);
            }

            this.addressForms.forEach(f => {
                let form = f.formElement;
                if (f.formElement.getAttribute('wagwoord-form-id')) return;
                const formId = this.$util.uuidv4();
                form.setAttribute('wagwoord-form-id', formId);
                f.id = formId;
                form.setAttribute('autocomplete', 'off');
                form.setAttribute('wagwoord-form-type', 'address');

                for(const property in f) {
                    if(property != 'formElement' && property.indexOf('assword') == -1 && property.endsWith('Element') && f.hasOwnProperty(property)) {
                        this.setaddressOnClickOpenPopUp(f[property], property.replace('Element', ''));
                    }
                }

                form.addEventListener('submit', event => {
                    this.onAddressFormSubmit(event);
                });

                // this.setaddressInputValue(f);
            });
        },
        openaddressDialog(address) {
            this.openDialog({
                title: address.action == 'update' ? 'Update password' : 'Save address',
                message: address.model.username || '[No username]',
                model: address.model,
                actions: [{
                        value: 'save',
                        class: 'success',
                        clickData: 'save',
                        method: 'dialogaddress'
                    },
                    {
                        value: 'reject',
                        class: 'error',
                        clickData: 'reject',
                        method: 'dialogaddress'
                    }
                ]
            });
        },
        async onAddressFormSubmit(event) {
            const formId = event.target.getAttribute('wagwoord-form-id');
            const model = {
                address: this.getAddressFromValues(formId)
            };

            if(!model.address) return;

            const response = await this.$chrome.formSubmittion("address", JSON.stringify(model));
            if (response.hasAction && response.address) {
                this.openaddressDialog(response.address);
            }
        },
        async dialogaddress(model, type) {
            if (!type || type == 'reject') {
                await this.$chrome.storage.removeItem('submitted');
            }

            this.$chrome.post({
                address: model
            });
        },
        setaddressOnClickOpenPopUp(element, type) {
            if (!element) return;

            if (type) {
                element.setAttribute('wagwood-input-type', type);
            }

            element.addEventListener('click', event => {
                this.openDropdown(event, this.getAddressDropDownModel());
            });

            element.setAttribute('autocomplete', 'off');

            if (this.$appData.addresses.length) {
                element.addEventListener('keyup', event => {
                    const inputType = event.target.getAttribute('wagwood-input-type');
                    let data = this.$appData.addresses;
                    if (event.target.value) {
                        data = this.$appData.addresses.filter(p => p[inputType] && p[inputType].toLowerCase().startsWith(event.target.value.toLowerCase()));
                    }
                    this.inputDropdownData.data = data && data.length ? data : this.$appData.addresses;
                });
            }
            element.addEventListener('blur', event => {
                const selectedElement = event.relatedTarget;
                if (!selectedElement || !selectedElement.getAttribute('wagwoord-app-field'));
                else if (selectedElement.getAttribute('wagwoord-data') == 'open-settings') {
                    const search = event.target.value ? '?search=' + encodeURIComponent(event.target.value) : '';
                    this.goToSettings('address?search=' + search);
                } else {
                    const form = this.addressForms.find(f => f.id == event.target.form.getAttribute('wagwoord-form-id'));
                    const passwordItem = this.$appData.addresses.find(p => p.id == selectedElement.id);
                    this.setaddressInputValue(form, passwordItem, event.target);
                }
                this.closeDropdown(event);
            });
        },
        setaddressInputValue(form, item, element) {
            if (!item && this.$appData.addresses.length) {
                item = this.$appData.addresses[0];
            }

            if (!item || !form) return;

            for(const property in form) {
                let forceChange = false;
                if(property != 'formElement' && property.endsWith('Element') && form.hasOwnProperty(property)) {
                    let value = item[property.replace('Element', '')];
                    const birthDate = item.birthDate ? new Date(item.birthDate) : undefined;
                    if(property == 'phoneElement' && !form.callingCodeElement) {
                        forceChange = !form.phoneElement.value || form.phoneElement.value.length <= 5;
                        value = '+' + item.callingCode + item.phone;
                    }
                    if(property == 'nameElement') {
                        value = item.firstName + ' ' + (!form.lastNameElement ? item.lastName : '');
                    }
                    if(property == 'passwordElement' || property == 'newPasswordElement') {
                        if(!item.password) {
                            item.password = this.$util.generatePassword(undefined, form[property].getAttribute('pattern'), this.$appData.settings.password);
                        }
                        value = item.password;
                    }
                    if(property == 'emailElement') {
                        value = item.username;
                    }
                    if(birthDate && property == 'birthDateDayElement') {
                        value = birthDate.getDate();
                        forceChange = true;
                    }
                    if(birthDate && property == 'birthDateMonthElement') {
                        value = birthDate.getMonth() + 1;
                        forceChange = true;
                    }
                    if(birthDate && property == 'birthDateYearElement') {
                        value = birthDate.getFullYear();
                        forceChange = true;
                    }

                    this.setValueToElement(form[property], value, !(forceChange || element.getAttribute('wagwood-input-type') == property.replace('Element', '')));
                }
            }
        }
    }
};