import {
    getLoginForms
} from '../common/form-detectors.js';

export default {
    data() {
        return {
            passwordForms: []
        };
    },
    methods: {
        getPasswordForms() {
            this.passwordForms = getLoginForms(window.location.host);
            this.setPasswordForms();
        },
        setPasswordForms() {
            this.setOnClickOpenPopUp(document.getElementById('login-form-username'));
        },
        setOnClickOpenPopUp(element) {
            element.addEventListener('focus', event => {
                this.openDropdown(event, {
                    valueField: 'username',
                    data: this.$appData.passwords
                });
            });
            element.addEventListener('focusout', event => {
                setTimeout(() => {
                    this.closeDropdown(event, {
                        valueField: 'username',
                        data: this.$appData.passwords
                    });
                }, 200);
            });
        }
    }
};