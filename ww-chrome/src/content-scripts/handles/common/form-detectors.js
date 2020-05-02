export function getForms(domain) {
    return getDefaultForm();
}

function getDefaultForm(formSettings, forms) {
    let results = [];
    const formElement = document.getElementsByTagName('form');
    const inputTypes = formSettings && formSettings.usernameInputType ? formSettings.usernameInputType : ['username', 'email', 'text'];

    for (let index = 0; index < formElement.length; index++) {
        const type = getFormType(formElement[index]);
        if (type == 'password') {
            results.push(checkLoginForm(formElement[index], inputTypes));
        } else if(type == 'address') {
            if (formElement[index].getAttribute('wagwoord-form-id')) continue;
            results.push(checkAddressForm(formElement[index]));
        } else if(type == 'creditcard') {
            if (formElement[index].getAttribute('wagwoord-form-id')) continue;
            results.push(checkCreditCardForm(formElement[index], inputTypes));
        } else {
            const pform = checkLoginForm(formElement[index], inputTypes);
            if (pform) {
                results.push(pform);
                continue;
            }
            if (formElement[index].getAttribute('wagwoord-form-id')) continue;
            const ccForm = checkCreditCardForm(formElement[index], inputTypes);
            if (ccForm) {
                results.push(ccForm);
                continue;
            }
            const addressForm = checkAddressForm(formElement[index]);
            if (addressForm) results.push(addressForm);
        }
    }

    return results;
}

// TODO: detect form
function getFormType(form) {
    if (form.getAttribute('wagwoord-form-type')) return form.getAttribute('wagwoord-form-type');
    return 'unknown';
}
// #region address form

function checkAddressForm(form) {
    // FIXME: this is bullshit
    if (form.getAttribute('wagwoord-form-id')) return;
    if (!form.elements.length) {
        return;
    }

    let result = {
        formElement: form,
        type: 'address'
    };
    const fields = [{
            name: 'firstName',
            regex: /.*(first|given)[ _-]?(name).*/g
        },
        {
            name: 'lastName',
            regex: /.*(last|sur|family)[ _-]?(name).*/g
        },
        {
            name: 'name',
            regex: /.*(full)?[ _-]?(name).*/g
        },
        {
            name: 'birthDateMonth',
            regex: /.*(birth)[ _-]?(day)[ _-]?(month).*/g
        },
        {
            name: 'birthDateYear',
            regex: /.*(birth)[ _-]?(day)[ _-]?(year).*/g
        },
        {
            name: 'birthDateDay',
            regex: /.*(birth)[ _-]?(day)[ _-]?(day).*/g
        },
        {
            name: 'birthDate',
            regex: /.*(birth)[ _-]?(day|date).*/g
        },
        {
            name: 'username',
            regex: /.*(username|email|mail|loginid).*/g
        },
        {
            name: 'email',
            regex: /.*(username|email|mail|loginid).*/g
        },
        {
            name: 'street',
            regex: /.*(street[ _-]?address|address[ _-]?line1).*/g
        },
        {
            name: 'city',
            regex: /.*(city|town).*/g
        },
        {
            name: 'state',
            regex: /.*(state).*/g
        },
        {
            name: 'country',
            regex: /.*(country).*/g
        },
        {
            name: 'postalCode',
            regex: /.*(postal|zip)[ _-]?(code)?.*/g
        },
        {
            name: 'organization',
            regex: /.*(organization).*/g
        },
        {
            name: 'phone',
            regex: /.*(phone|tel|mobile)[ _-]?(number|nu|nr|no)?.*/g
        },
        {
            name: 'callingCode',
            regex: /.*(calling)[ _-]?(code)?.*/g
        },
        {
            name: 'region',
            regex: /.*(region).*/g
        },
        {
            name: 'subregion',
            regex: /.*(subregion).*/g
        },
        {
            name: 'countryCode',
            regex: /.*(country)[ _-]?(code).*/g
        },
        {
            name: 'password',
            regex: /.*(new)?[ _-]?(password).*/g
        },
        {
            name: 'newPassword',
            regex: /.*(confirm)[ _-]?(password).*/g
        }
    ];
    let hasFields = 0;
    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        for (let j = 0; j < fields.length; j++) {
            const field = fields[j];
            if (testTag(element, field.regex, field.skipType)) {
                if (result[field.name + 'Element']) continue;
                hasFields++;
                element.setAttribute('wagwood-input-type', field.name);
                switch (field.name) {
                    case 'name':
                        if (!result.lastNameElement) result[field.name + 'Element'] = element;
                        else result.firstNameElement = element;
                        break;
                    default:
                        result[field.name + 'Element'] = element;
                        break;
                }

                break;
            }
        }
    }
    if (hasFields > 2) {
        return result;
    }
}
// #endregion address form

// #region credit card form

function checkCreditCardForm(form, inputTypes) {
    if (form.getAttribute('wagwoord-form-id')) return;
    const fields = checkInputFileds(form);
    const isNotCCFrom = !testTag(form, /.*(credit|card|([ -_]+cc)).*/g);
    if (!fields || !fields.length) {
        return;
    }
    let cscInput = getFormInputOrDefault(fields, /.*(cvv|csc|cvc).*/g);
    if (!cscInput && isNotCCFrom) return;
    return {
        formElement: form,
        cvcElement: cscInput,
        nameElement: getFormInputOrDefault(fields, /.*(name|owner|holder).*/g),
        numberElement: getFormInputOrDefault(fields, /.*(number|nr|no).*/g),
        expMonthElement: getFormInputOrDefault(fields, /.*(month).*/g),
        expYearElment: getFormInputOrDefault(fields, /.*(year).*/g),
        expElement: undefined, // getFormInputOrDefault(fields, /.*(exp).*/g),
        typeElement: getFormInputOrDefault(fields, /.*(type).*/g),
        type: "creditcard"
    };
}
// #endregion credit card form

// #region login form
// var manualFormDomains = [{
//     domain: 'google.com',
//     usernameInputType: ['email'],
//     resolver: false,
//     disableDomainChangeEvent: true
// }];

export function getLoginForms(domain) {
    const forms = getForms(domain);
    return forms.filter(f => f.type == 'password');
}

function checkLoginForm(form, inputTypes) {
    if (form.getAttribute('wagwoord-form-id') && form.getAttribute('wagwoord-form-type' != 'password')) {
        return;
    }

    const passwordElements = checkInputFileds(form, 'password');
    const isNotLoginFrom = !testTag(form, /.*(log[ -_]?in|sign[ -_]?in).*/g);
    if(isNotLoginFrom && (testTag(form, /.*(credit|card|([ -_]+cc)).*/g) || testTag(form, /.*(sign[ -_]?up|reg).*/g))) {
        return;
    }

    if (passwordElements.length != 1 && isNotLoginFrom) return;

    const passwordElement = getFormInput(passwordElements, /.*(password).*/g);
    let usernameElement = checkInputFileds(form, inputTypes);
    if (!usernameElement.length && !passwordElement) {
        return;
    }
    usernameElement = getFormInput(usernameElement, /.*(name|email|mail|id).*/g);

    return {
        formElement: form,
        formId: form.getAttribute('wagwoord-form-id'),
        passwordElement: passwordElement,
        usernameElement: usernameElement || false,
        type: "password"
    };
}

// #endregion login form
// #region utils
function getFormInputOrDefault(inputs, regex, def) {
    if (!inputs) return;
    if (!Array.isArray) inputs = [inputs];
    if (!inputs.length) return;
    for (let i = 0; i < inputs.length; i++) {
        if (testTag(inputs[i], regex)) return inputs[i];
    }

    return def;
}

function getFormInput(inputs, regex) {
    return getFormInputOrDefault(inputs, regex, (inputs && inputs.length ? inputs[0] : undefined));
}

function testTag(input, regex, sciptType) {
    if (input.id && input.id == 'string' && regex.test((input.id.toLowerCase()))) return true;
    else if (input.name && typeof input.name == 'string' && regex.test((input.name.toLowerCase()))) return true;
    else if (input.autocapitalize && typeof input.autocapitalize == 'string' && regex.test((input.autocapitalize.toLowerCase()))) return true;
    else if (input.autocomplete && typeof input.autocomplete == 'string' && regex.test((input.autocomplete.toLowerCase()))) return true;
    else if (!sciptType && input.type && typeof input.type == 'string' && regex.test((input.type.toLowerCase()))) return true;
    else if (input.action && typeof input.action == 'string' && regex.test((input.action.toLowerCase()))) return true;
    // else if (input.className && regex.test(input.className)) return true;
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
        } else if (!inputType && formElement instanceof HTMLInputElement) {
            results.push(formElement);
        } else if (Array.isArray(inputType) && formElement instanceof HTMLInputElement && inputType.indexOf(formElement.type) > -1) {
            results.push(formElement);
        } else if (formElement instanceof HTMLInputElement && formElement.type == inputType) {
            results.push(formElement);
        }
    }

    return results;
}
// #endregion utils