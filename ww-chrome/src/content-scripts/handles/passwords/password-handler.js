export default {
    computed: {
        passwordForms() {
            return this.forms.filter(f => f.type == 'password');
        },
        costumForms() {
            return [{
                domain: 'https://accounts.google.com'

            }];
        }
    },
    methods: {
        passwordFormsInit(submittedResponse) {
            if (submittedResponse && submittedResponse.password) {
                this.openPasswordDialog(Object.assign({}, submittedResponse.password));
                submittedResponse.password = undefined;
            }

            this.passwordForms.forEach(f => {
                let form = f.formElement;
                if (f.formElement.getAttribute('wagwoord-form-id')) {
                    if (form.getAttribute('wagwoord-form-type') != 'password') return;

                    if (f.passwordElement && !f.passwordElement.getAttribute('wagwood-input-type')) {
                        this.setOnClickOpenPopUp(f.passwordElement, 'password');
                        this.setPasswordFormValue(f, undefined, undefined, true);
                    }

                    if (f.usernameElement && !f.usernameElement.getAttribute('wagwood-input-type')) {
                        this.setOnClickOpenPopUp(f.usernameElement, 'username');
                        this.setPasswordFormValue(f, undefined, undefined, true);
                    }

                    return;
                }

                const formId = this.$util.uuidv4();
                form.setAttribute('wagwoord-form-id', formId);
                f.id = formId;
                form.setAttribute('autocomplete', 'off');
                form.setAttribute('wagwoord-form-type', 'password');

                this.setOnClickOpenPopUp(f.passwordElement, 'password');
                this.setOnClickOpenPopUp(f.usernameElement, 'username');

                form.addEventListener('submit', event => {
                    this.onPasswordFormSumbit(event);
                });

                this.setPasswordFormValue(f, undefined, undefined, true);
            });
        },
        openPasswordDialog(password) {
            this.openDialog({
                title: password.action == 'update' ? 'Update password' : 'Save password',
                message: password.model.username || '[No username]',
                model: password.model,
                actions: [{
                        value: 'save',
                        class: 'success',
                        clickData: 'save',
                        method: 'dialogPasswordSubmit'
                    },
                    {
                        value: 'reject',
                        class: 'error',
                        clickData: 'reject',
                        method: 'dialogPasswordSubmit'
                    }
                ]
            });
        },
        async onPasswordFormSumbit(event) {
            const formId = event.target.getAttribute('wagwoord-form-id');
            if (!formId) return;
            const form = this.passwordForms.find(f => f.id == formId);
            if (!form.passwordElement.value) return;

            const model = {
                password: {
                    username: form.usernameElement.value,
                    password: form.passwordElement.value,
                    domain: window.location.href
                }
            };

            const response = await this.$chrome.formSubmittion("password", JSON.stringify(model));
            if (response.hasAction && response.password) {
                this.openPasswordDialog(response.password);
            }
        },
        async dialogPasswordSubmit(model, type) {
            if (!type || type == 'reject') {
                await this.$chrome.storage.removeItem('submitted');
            }

            this.$chrome.post({
                password: model
            });
        },
        setOnClickOpenPopUp(element, type) {
            if (!element) return;

            if (type) {
                element.setAttribute('wagwood-input-type', type);
            }

            element.addEventListener('click', event => {
                this.openDropdown(event, {
                    valueField: 'username',
                    info: item => {
                        return `<i>${item.domain}</i>`;
                    },
                    data: this.$appData.passwords
                });
            });

            element.setAttribute('autocomplete', 'off');

            if (this.$appData.passwords.length) {
                element.addEventListener('keyup', event => {
                    if (event.target.getAttribute('wagwood-input-type') == 'username') {
                        let data = this.$appData.passwords;
                        if (event.target.value) {
                            data = this.$appData.passwords.filter(p => p.username.startsWith(event.target.value.toLowerCase()));
                        }
                        this.inputDropdownData.data = data && data.length ? data : this.$appData.passwords;
                    } else {
                        if (event.target.value) {
                            this.closeDropdown();
                        } else {
                            this.openDropdown(event, {
                                valueField: 'username',
                                data: this.$appData.passwords
                            });
                        }
                    }
                });
            }
            element.addEventListener('blur', event => {
                const selectedElement = event.relatedTarget;
                if (!selectedElement || !selectedElement.getAttribute('wagwoord-app-field')) {
                    this.closeDropdown(event);
                    return;
                }
                if (selectedElement.getAttribute('wagwoord-data') == 'open-settings') {
                    let url = this.$util.getName(window.location.origin, true);
                    url = encodeURIComponent(url);
                    this.goToSettings('?search=' + url);
                    this.closeDropdown(event);
                } else {
                    const form = this.passwordForms.find(f => f.id == event.target.form.getAttribute('wagwoord-form-id'));
                    const passwordItem = this.$appData.passwords.find(p => p.id == selectedElement.id);
                    this.setPasswordFormValue(form, passwordItem, event.target);
                }
            });
        },
        getDefaultPassword() {
            let item = this.$appData.passwords[0];
            let idElement;
            switch (location.origin) {
                case 'https://accounts.google.com':
                    idElement = document.getElementById('profileIdentifier');
                    if (idElement && idElement.innerText) item = this.$appData.passwords.find(p => p.username == idElement.innerText);
                    break;
                case 'https://login.live.com':
                    idElement = document.getElementById('displayName');
                    if (idElement && idElement.innerText) item = this.$appData.passwords.find(p => p.username == idElement.innerText);
                    break;
            }

            return item;
        },
        setPasswordFormValue(form, passwordItem, element, isAuto) {
            if (!passwordItem && this.$appData.passwords.length) {
                passwordItem = this.getDefaultPassword();
            }

            if (!passwordItem || !form) return;
            this.setValueToElement(form.passwordElement, passwordItem.password);
            this.setValueToElement(form.usernameElement, passwordItem.username, element && element.getAttribute('wagwood-input-type') == 'password');
        }
    }
};