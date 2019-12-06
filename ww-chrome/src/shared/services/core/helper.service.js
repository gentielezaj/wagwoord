export function copy(model) {
    if (model === undefined || model === null) {
        return model;
    }

    // return JSON.parse(JSON.stringify(model));

    if (Array.isArray(model)) {
        let arrayResult = [];
        model.forEach(m => arrayResult.push(copy(m)));
        return arrayResult;
    }

    if (typeof model === 'boolean') return Boolean(model);
    if (typeof model === 'number') return Number(model);
    if (Object.prototype.toString.call(model) === '[object Date]') return new Date(model);
    if (typeof model === 'string') return model + '';

    if (typeof model === 'object') {
        let resultObject = {};
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                resultObject[key] = copy(model[key]);
            }
        }
        return resultObject;
    }

    if (typeof model === 'function') {
        return function (...params) {
            model(...params);
        };
    }

    return model;
}

export function merge(model, item) {
    return undefined;
}

export function clipboard(value) {
    const el = document.createElement('textarea');
    el.value = value;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
}

export function getName(domain, min) {
    domain = getDomain(domain, !(/^http(s)?:[/]{2}localhost/.test(domain)));
    domain = domain.replace(/http(s)?:\/\//, '');
    if (!min || !/[a-zA-Z]+/.test(domain)) {
        return domain;
    }
    let splitedDomain = domain.split('.');
    if (splitedDomain.length <= 2) return domain;
    return splitedDomain[splitedDomain.length - 2] + '.' + splitedDomain[splitedDomain.length - 1];
}

export function getDomain(domain, removePort) {
    if (!domain || domain.startsWith('android:')) return domain;
    // const regex = /(chrome-)?(extension:){1}(\/){2}\w+\//g;
    // if(regex.test(domain)) {
    //     domain = domain.match(regex);
    //     console.log('domain ' + domain);
    //     return;
    // }

    if (!(/http(s)?:/.test(domain))) {
        return domain;
    }
    try {
        let url = new URL(domain);
        return url.port && removePort ? url.origin.replace(`:${url.port}`, '') : url.origin;
    } catch (error) {
        throw error;
    }
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0;
        let v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getTextFromFile(file) {
    if (!file) return undefined;
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.readAsText(file);
    });
}