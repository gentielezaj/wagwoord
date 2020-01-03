import { WWUtil } from '../util/ww-util';

export default class ChromeService {
    constructor(key) {
        this.key = key;
        Object.freeze(this.key);
        this.util = WWUtil;
    }

    async get() {
        const result = await chromeStorage('get', this.key);
        return typeof result[this.key] !== 'string' ? result[this.key] : JSON.parse(result[this.key]);
    }

    async set(value) {
        if (!value) return false;

        let save = {};
        save[this.key] = JSON.stringify(value);

        return await chromeStorage('set', save);
    }

    async remove() {
        return await chromeStorage('remove', this.key);
    };

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