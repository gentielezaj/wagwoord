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
        if(typeof manualFormDomains[i].resolver === 'function') return manualFormDomains[i].resolver();
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
        const passwordElements = checkInputFileds(formElement[index], 'password');
        if(!passwordElements || passwordElements.length != 1) {
            continue;
        }
        const passwordElement = passwordElements[0];
        if (passwordElement) {
            const usernameElement = checkInputFileds(formElement[index], inputTypes);
            if(usernameElement && usernameElement.length > 1) continue;
            results.push({
                formElement: formElement[index],
                passwordElement: passwordElement,
                usernameElement: usernameElement && usernameElement.length ? usernameElement[0] : false
            });
        }
    }

    return results;
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
        } else if(formElement instanceof HTMLInputElement && formElement.type == inputType) {
            results.push(formElement);
        }
    }

    return results;
}