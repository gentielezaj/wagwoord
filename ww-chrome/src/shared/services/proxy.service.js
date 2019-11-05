import ChromeService from './chrome.service';

export class ProxySettingsService {
    constructor() {
        this.chrome = new ChromeService('proxy');
    }

    async get(property) {
        const model = await this.chrome.get();
        return model && property ? model[property] : model;
    }

    // #region crud
    async save(model) {
        if (typeof model !== 'object' && model !== undefined) return false;

        if (!model || (typeof model === 'object' && !model.domain && !model.headers)) {
            await this.chrome.remove();
            return true;
        }

        if (model.domain && model.domain.trim() === '') {
            model.domain = undefined;
        }

        if (model.headers && model.headers.trim() === '') {
            model.headers = undefined;
        }

        try {
            await this.chrome.set(model);
            return true;
        } catch (error) {
            throw error;
        }
    }

    isValid(model) {
        if (!model || typeof model != 'object') return false;
        return model.hasOwnProperty('encryptionKey') && model.hasOwnProperty('encryptLocalty');
    }
    // #endregion crud
}

export class ProxyService {
    constructor(controller) {
        this.settings = new ProxySettingsService();
        this.controller = controller;
    }
    // #region get requests
    get(params, action, controller, domain, headers) {
        try {
            return this.request('GET', undefined, params, action, controller, domain, headers);
        } catch (error) {
            throw error;
        }
    }
    // #endregion get requests

    // #region post requests
    post(data, params, action, controller, domain, headers) {
        return this.request('POST', data, params, action, controller, domain, headers);
    }
    // #endregion requests

    // #region delete request
    delete(params, action, controller, domain, headers) {
        return this.request('DELETE', undefined, params, action, controller, domain, headers);
    }

    deleteAll(params, controller, domain, headers) {
        return this.delete(params, 'all', controller, domain, headers);
    }
    // #endregion delete request

    patch(params, action, controller, domain, headers) {
        return this.request('PATCH', undefined, params, action, controller, domain, headers);
    }

    // #region core request
    async request(method, data, params, action, controller, domain, headers) {
        const config = await this.settings.get();
        if (!config.domain && !domain) return {
            success: true,
            unsetProxy: true
        };

        const url = getUrl(domain || config.domain, controller || this.controller, action, params);
        headers = getHeaders(headers || config.headers);
        const requestData = {
            headers: headers,
            method: method,
            body: data ? JSON.stringify(data) : undefined
        };

        try {
            let response = await fetch(url, requestData);
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
    // #endregion core request
}

function getHeaders(headers) {
    if (!headers) return undefined;
    if (typeof headers === 'object') return headers;
    let results = {};
    let s = headers.split('\n');
    s.forEach(h => {
        const hsplit = h.split(':');
        results[hsplit[0].trim()] = hsplit[1].trim();
    });

    results.mode = 'cros';

    return results;
}

function getUrl(domain, controller, action, params) {
    let url = domain + (domain.endsWith('/') ? '' : '/');
    url += controller.replace(/\/*/, '') + '/';
    url += action ? action.replace(/\/*/, '') + '/' : '';
    if (params === undefined || params === null) return url;

    if (params !== 'object') return url + params;
    let paramList = [];
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            paramList.push(`${key}=${params[key]}`);
        }
    }

    return `${url}?${paramList.join('&')}`;
}