import ChromeService from './chrome.service';
import EncryptionService from './encryprion.service';
import {
    hotp
} from "otplib";

export class ProxySettingsService {
    constructor() {
        this.chrome = new ChromeService('proxy');
        this.encryptionService = new EncryptionService();
    }

    async get(property) {
        let model = (await this.chrome.get()) || {};
        model.hash = await this.encryptionService.getHash();
        return model && property ? model[property] : model;
    }

    getDomain() {
        return this.get('domain');
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

    async removeDomain() {
        let model = (await this.chrome.get()) || {};
        model.domain = undefined;
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

        model = {
            headers: model.headers,
            domain: model.domain
        };

        try {
            await this.chrome.set(model);
            return true;
        } catch (error) {
            throw error;
        }
    }
    // #endregion crud
}

export class ProxyService {
    constructor(controller) {
        this.settings = new ProxySettingsService();
        this.controller = controller;
        this.encryptionService = new EncryptionService();
    }

    // #region request methodes
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

    postRequest(action, data, params, controller, domain, headers) {
        return this.post(data, params, action, controller, domain, headers);
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
    // #endregion request methodes

    // #region check server state

    async credentialsFor(encryptionKey) {
        try {
            const newEncryptionHash = await this.encryptionService.getHash(encryptionKey);
            const oldEncryptionHash = await this.encryptionService.getHash();
            const response = await this.request('Post', {
                newEncryptionHash,
                oldEncryptionHash
            }, undefined, '', 'auth');

            return response.data;
        } catch (error) {
            console.error(error);
            return 'unAuthorised';
        }
    }

    async isSet() {
        let hasValue = await this.getProxyStatus();
        return hasValue == 'ok';
    }

    async checkProxy() {
        try {
            const serverStatus = await this.getProxyStatus(true);
            return serverStatus == 'ok';
        } catch (error) {
            throw error;
        }
    }

    async getProxyStatus(force) {
        let serverStatus = await this.settings.chrome.get('server-status');
        try {
            if (!force) return serverStatus;
            const config = await this.settings.get();
            const domain = config?.domain;
            if (!domain) serverStatus = 'off';
            else {
                const response = await this.request('GET', undefined, undefined, 'isValidConnection', 'auth');
                serverStatus = response.success ? 'ok' : 'error';
            }
        } catch (error) {
            serverStatus = 'error';
        }

        await this.settings.chrome.set(serverStatus, 'server-status');
        return serverStatus;
    }
    // #endregion check server state

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
        const config = await this.settings.get();
        if (!config || (!config.domain && !domain)) return {
            success: false,
            unsetProxy: true
        };

        const url = getUrl(domain || config.domain, controller || this.controller, action, params);
        headers = getHeaders(headers || config.headers, config.hash);
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

function getHeaders(headers, hash) {
    if (!headers) headers = {};
    headers.mode = 'cros';

    if (hash) {
        try {
            const time = new Date().getTime();
            const code = hotp.generate(hash, time);

            console.log('hash: ' + hash);

            console.log('isvalid: ' + hotp.check(code, hash, time));
            console.log('isvalid: ' + hotp.verify({
                token: hash,
                secret: code
            }));
            headers.hash = code + "-" + time;
        } catch (error) {
            console.error(error);
        }
    }

    headers["Content-Type"] = "application/json";

    return headers;
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