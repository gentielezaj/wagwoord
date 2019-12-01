import {
    getLoginForms
} from '../common/form-detectors.js';
import {
    uuidv4
} from '../../../shared/services/core/helper.service';

const htmlTagAttributes = {
    formId: 'wagwoord-password-form-id',
    dialogId: "wagwoord-password-input-dialog-id",
    dualogUlId: "wagwoord-password-input-dialog-ul-id",
    passwordId: "wagwoord-password-id"
};

const htmlElementIds = {
    spanWrapper: "wagwoord-password-input-wapper",
    dialogDiv: "wagwoord-password-input-dialog-div",
    ulId: "wagwoord-password-input-dialog-ul"
};

export default class PasswordHandler {
    constructor(passwords, settings, blacklist) {
        this.passwords = passwords || [];
        this.settings = settings || {};
        this.blacklist = blacklist || false;

        this.waitTime = 0;
        passwords.forEach(element => {
            if (element.waitTime && this.waitTime < element.waitTime) {
                this.waitTime = element.waitTime;
            }
        });

        this.init();
    }

    init() {
        if(!this.blacklist || !this.blacklist.password)
            setTimeout(() => this.coreinitForm(), this.waitTime || 0);
    }

    // #region from
    coreinitForm() {
        let pass = this.passwords.length ? this.passwords[0] : {};
        this.forms = getLoginForms(window.location.host);
        this.forms.forEach(f => {
            const formId = uuidv4();
            f.id = formId;
            f.formElement.setAttribute('autocomplete', 'off');
            f.formElement.setAttribute(htmlTagAttributes.formId, formId);
            f.formElement.addEventListener('submit', event => {
                this.onSubmit(event);
            });
            if(f.usernameElement.value) {
                pass = this.passwords.find(p => p.username == f.usernameElement.value) || pass;
            }
            this.setUpInput(f.passwordElement, formId, pass.password);
            this.setUpInput(f.usernameElement, formId, pass.username);
        });

        if (this.forms.length == 1 && this.settings.autoSubmit) {
            this.forms[0].formElement.submit();
        }
    }

    setUpInput(input, formId, value) {
        if (!input) return;
        input.setAttribute(htmlTagAttributes.formId, formId);
        if (value) {
            input.value = value;
            input.dispatchEvent(new Event('change'));
        }

        input.setAttribute('autocomplete', 'off');
        this.setUpDropDownForInput(input, formId);
    }

    setUpDropDownForInput(input, formId) {
        if (input.getAttribute(htmlTagAttributes.dialogId)) return;

        const popupId = uuidv4();
        input.setAttribute(htmlTagAttributes.dialogId, popupId);

        let wrapperdiv = document.createElement('span');
        wrapperdiv.id = htmlElementIds.spanWrapper;
        input.parentNode.insertBefore(wrapperdiv, input);
        wrapperdiv.appendChild(input);

        let passwordDialog = document.createElement('div');
        passwordDialog.id = htmlElementIds.dialogDiv;
        passwordDialog.setAttribute(htmlTagAttributes.dialogId, popupId);
        passwordDialog.setAttribute('tabindex', 0);

        passwordDialog.appendChild(this.addPasswordList(formId));
        wrapperdiv.appendChild(passwordDialog);

        input.addEventListener('focus', e => this.setDisplayOnEventListener(e, 'block'));
        input.addEventListener('blur', e => this.setDisplayOnEventListener(e, 'none'));
    }

    addPasswordList(inputId) {
        const ul = document.createElement('ul');
        ul.setAttribute(htmlTagAttributes.dualogUlId, inputId);
        ul.id = htmlElementIds.ulId;
        this.passwords.forEach(p => {
            const li = document.createElement('li');
            li.setAttribute(htmlTagAttributes.passwordId, p.id);
            li.setAttribute('tabindex', 0);
            li.innerHTML = p.username;
            ul.appendChild(li);
        });

        return ul;
    }

    setDisplayOnEventListener(e, displayValue) {
        const id = e.target.getAttribute(htmlTagAttributes.dialogId);
        const element = document.querySelector(`div[${htmlTagAttributes.dialogId}="${id}"]`);
        element.style.display = displayValue || '';
        if (e.relatedTarget && e.relatedTarget.getAttribute(htmlTagAttributes.passwordId)) this.setListPassword(e.relatedTarget);
    }

    setListPassword(target) {
        // TODO: not change username if not null
        const iId = target.parentNode.getAttribute(htmlTagAttributes.dualogUlId);
        const pId = target.getAttribute(htmlTagAttributes.passwordId);
        const form = this.forms.filter(f => f.id == iId)[0];
        const password = this.passwords.filter(p => p.id == pId)[0];

        const inputId = target.parentNode.parentNode.getAttribute(htmlTagAttributes.dialogId);
        const query = `input[${htmlTagAttributes.dialogId}="${inputId}"]`;
        const input = form.formElement.querySelector(query);
        this.setValueToFields(form, password, input.type != 'password');
    }

    setValueToFields(form, password, changeUsername) {
        form.passwordElement.value = password.password;
        if(!form.usernameElement.value || changeUsername) {
            form.usernameElement.value = password.username;
            form.usernameElement.dispatchEvent(new Event('change'));
        }

        form.passwordElement.dispatchEvent(new Event('change'));
    }

    onSubmit(event) {
        const id = event.target.getAttribute(htmlTagAttributes.formId);
        const form = this.forms.find(f => f.id == id);
        console.log(form.passwordElement.value);
        console.log(form.usernameElement.value);
        sessionStorage.removeItem("submitted");
        const model = {
            password: {
                username: form.usernameElement.value,
                password: form.passwordElement.value,
                domain: window.location.href
            }
        };

        sessionStorage.setItem("submitted", JSON.stringify(model));
    }
    // #endregion from
}