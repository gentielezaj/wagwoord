import ChromeService from '../services/chrome.service';
import BlacklistService from '../services/blacklist/blacklist.service';

export default {
    namespaced: true,
    state: {
        chrome: new ChromeService(),
        blacklist: new BlacklistService()
    },
    getters: {
        selectedTab: async store => {
            let tab = await store.chrome.selectedTab();
            tab.wwurl = store.blacklist.$password.getName(tab.url, true);
            return tab;
        },
        activeTabData: async store => {
            let tab = await store.chrome.selectedTab();
            tab.wwurl = store.blacklist.$password.getName(tab.url, true);
            let blacklist = await store.blacklist.checkUrl(tab.url);
            return {
                tab,
                blacklist
            };
        }
    }
};