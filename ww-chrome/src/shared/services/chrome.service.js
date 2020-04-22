import { WWUtil } from '../util/ww-util';

export default class ChromeService {
    constructor(key) {
        this.key = key;
        Object.freeze(this.key);
        this.util = WWUtil;
    }

    get manifest() {
        return chrome.runtime.getManifest();
    }

    get version() {
        return this.manifest.version;    
    }

    async get(key) {
        let result = await chromeStorage('get', key || this.key);
        if(typeof result[key || this.key] == 'string' && !result[key || this.key].startsWith('{')) return result[key || this.key];
        return typeof result[key || this.key] !== 'string' ? result[key || this.key] : JSON.parse(result[key || this.key]);
    }

    async set(value, key) {
        if (!value) return false;

        let save = {};
        save[key || this.key] = typeof value == 'string' ? value : JSON.stringify(value);

        return await chromeStorage('set', save);
    }

    async remove(key) {
        return await chromeStorage('remove', key || this.key);
    };

    async clear() {
        return new Promise(resolve => {
            chrome.storage.local.clear(result => {
                resolve(true);
            });
        });
    }

    async selectedTab() {
        return new Promise((resolve) => {
            chrome.tabs.query({
                currentWindow: true,
                active: true
            }, function (tabs) {
                resolve(tabs[0]);
            });
        });
    }

    async currentWindow() {
        return new Promise((resolve) => {
            chrome.windows.getCurrent(null, (t) => resolve(t));
        });
    }

    open(url, hardMatch) {
        if (typeof url === 'object') {
            hardMatch = url.hardMatch;
            url = url.url;
        }
        let searchUrl = this.util.copy(url);
        if (!hardMatch) {
            searchUrl = this.util.getDomain(searchUrl);
            if(searchUrl.indexOf('#') > -1) {
                searchUrl = searchUrl.substring(0, searchUrl.indexOf('#'));
            }
        }

        chrome.tabs.query({
            currentWindow: true
        }, tabs => {
            for (const tab of tabs) {
                if (tab.url.indexOf(searchUrl) > -1) {
                    chrome.tabs.update(tab.id, {
                        active: true,
                        url
                    });
                    return true;
                }
            }
            chrome.tabs.create({
                url
            });

            return false;
        });
    }
}

async function chromeStorage(operation, key) {
    if (!operation || !key) return false;
    return new Promise(resolve => {
        chrome.storage.local[operation](key, result => {
            resolve(result || true);
        });
    });
}