// #region login form
var manualFormDomains = [{
    domain: 'google.com',
    usernameInputType: ['email'],
    resolver: false,
    disableDomainChangeEvent: true
}];

export function getLoginForms(domain) {
    domain = domain ? domain.toLowerCase() : domain;
    // eslint-disable-next-line no-unmodified-loop-condition
    for (let i = 0; domain && i < manualFormDomains.length && domain.indexOf(manualFormDomains[i].domain) > -1; i++) {
        if (typeof manualFormDomains[i].resolver === 'function') return manualFormDomains[i].resolver();
        let form = getDefaultForm(manualFormDomains[i]);
        form.disableDomainChangeEvent = true;

        return form;
    }

    return getDefaultForm();
}

function getDefaultForm(formSettings) {
    let results = [];
    const formElement = document.getElementsByTagName('form');
    const inputTypes = formSettings && formSettings.usernameInputType ? formSettings.usernameInputType : ['username', 'email', 'text'];

    for (let index = 0; index < formElement.length; index++) {
        const form = formElement[index];
        if (form.getAttribute('wagwoord-form-id')) continue;
        const passwordElements = checkInputFileds(form, 'password');
        const isNotLoginFrom = !testTag(form, /.*(log[ -_]?in|sign[ -_]?in).*/g);
        if ((!passwordElements || passwordElements.length != 1) && isNotLoginFrom) {
            continue;
        }
        const passwordElement = getloginFormUsernameInput(passwordElements, /.*(password).*/g);
        if (passwordElement) {
            let usernameElement = checkInputFileds(form, inputTypes);
            if (usernameElement && usernameElement.length > 1 && isNotLoginFrom) {
                continue;
            }
            usernameElement = getloginFormUsernameInput(usernameElement, /.*(name|email|mail|id).*/g);
            results.push({
                formElement: form,
                passwordElement: passwordElement,
                usernameElement: usernameElement || false
            });
        }
    }

    return results;
}

function getloginFormUsernameInput(inputs, regex) {
    if (!inputs) return;
    if (!Array.isArray) inputs = [inputs];
    if(!inputs.length) return;
    for (let i = 0; i < inputs.length && testTag(inputs[i], regex); i++) {
        return inputs[i];
    }

    // TODO: return most match

    return inputs[0];
}
// #endregion login form

function testTag(input, regex) {
    if (input.id && regex.test(input.id)) return true;
    else if (input.name && regex.test(input.name)) return true;
    else if (input.autocapitalize && regex.test(input.autocapitalize)) return true;
    else if (input.autocomplete && regex.test(input.autocomplete)) return true;
    else if (input.type && regex.test(input.type)) return true;
    else if (input.className && regex.test(input.className)) return true;
    return false;
}

function checkInputFileds(form, inputType) {
    let results = [];
    for (let j = 0; j < form.children.length; j++) {
        const formElement = form.children[j];
        if (formElement.children && formElement.children.length) {
            let inputElement = checkInputFileds(formElement, inputType);
            if (inputElement && inputElement.length) {
                inputElement.forEach(i => results.push(i));
            }
        } else if (Array.isArray(inputType) && formElement instanceof HTMLInputElement && inputType.indexOf(formElement.type) > -1) {
            results.push(formElement);
        } else if (formElement instanceof HTMLInputElement && formElement.type == inputType) {
            results.push(formElement);
        }
    }

    return results;
}