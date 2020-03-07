import ChromeService from './chrome.service';

export class ProxySettingsService {
    constructor() {
        this.chrome = new ChromeService('proxy');
    }

    async get(property) {
        let model = await this.chrome.get();
        if (model && model.headers) model.headers = JSON.parse(model.headers);
        return model && property ? model[property] : model;
    }

    // #region crud
    async setHeaders(headers) {
        let model = await this.get() || {};
        model.headers = headers;
        return await this.save(model);
    }

    async addHeaders(header) {
        let model = await this.get() || {};

        model.headers = {
            ...model.headers,
            ...header
        };

        return await this.save(model);
    }

    async removeHeaders(headerKey) {
        let model = await this.get();
        if (!model) return true;

        if (model.headers.hasOwnProperty(headerKey))
            delete model.headers[headerKey];

        return await this.save(model);
    }

    async save(model) {
        if (typeof model !== 'object' && model !== undefined) return false;

        if (!model || (typeof model === 'object' && !model.domain && !model.headers)) {
            await this.chrome.remove();
            return true;
        }

        if (model.domain && model.domain.trim() === '') {
            model.domain = undefined;
        }

        if (typeof model.headers == 'object') {
            model.headers = JSON.stringify(model.headers);
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

    // #region settings
    async setHeaders(headers) {
        return this.settings.setHeaders(headers);
    }

    async save(model) {
        return this.settings.save(model);
    }

    async getSettings(key) {
        return await this.settings.get(key);
    }

    async getDomain() {
        return await this.getSettings('domain');
    }
    // #endregion settings

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

    async isSet() {
        let hasValue = await this.settings.chrome.get('server-status');
        if (!hasValue) hasValue = await this.checkProxy();

        if (!hasValue || hasValue == 'error') return false;

        const config = await this.settings.get();
        return !config || !config.domain ? undefined : config;
    }

    async checkProxy() {
        try {
            const response = await this.baseRequest('GET', undefined, undefined, 'isValidConnection', 'util');
            const ok = response.hasOwnProperty('unsetProxy') ? false : response.status == 200;
            await this.settings.chrome.set((ok ? 'ok' : 'error'), 'server-status');

            return ok;
        } catch (error) {
            throw error;
        }
    }

    // #region core request
    async request(method, data, params, action, controller, domain, headers) {
        try {
            let response = await this.baseRequest(method, data, params, action, controller, domain, headers);
            return response.hasOwnProperty('unsetProxy') ? response : await response.json();
        } catch (error) {
            throw error;
        }
    }

    async baseRequest(method, data, params, action, controller, domain, headers) {
        const config = await this.getSettings();
        if (!config || (!config.domain && !domain)) return {
            success: true,
            unsetProxy: true
        };

        const url = getUrl(domain || config.domain, controller || this.controller, action, params);
        headers = getHeaders(headers || config.headers);
        const requestData = {
            headers: headers,
            method: method,
            body: typeof data == "object" ? JSON.stringify(data) : data
        };

        try {
            return await fetch(url, requestData);
        } catch (error) {
            throw error;
        }
    }
    // #endregion core request
}

function getHeaders(headers) {
    if (!headers) return undefined;
    if (typeof headers === 'object') {
        headers.mode = 'cros';
        return headers;
    }
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