export default class ChromeService {
    constructor(key) {
        this.key = key;
        Object.freeze(this.key);
    }

    async get() {
        const result = await chromeStorage('get', this.key);
        return typeof result[this.key] !== 'string' ? result[this.key] : JSON.parse(result[this.key]);
    }

    async set(value) {
        if(!value) return false;

        let save = {};
        save[this.key] = JSON.stringify(value);

        return await chromeStorage('set', save);
    }

    async remove() {
        return await chromeStorage('remove', this.key);
    };

    async selectedTab() {
        return new Promise((resolve) => {
            chrome.tabs.getSelected(null, async function (tab) {
                resolve(tab);
            });
        });
    }
}

async function chromeStorage(operation, key) {
    if(!operation || !key) return false;
    return new Promise(resolve => {
        chrome.storage.local[operation](key, result => {
            resolve(result || true);
        });
    });
}