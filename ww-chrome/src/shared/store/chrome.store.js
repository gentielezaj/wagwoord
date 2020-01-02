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
            tab.wwurl = store.chrome.util.getName(tab.url, true);
            console.log(tab);
            return tab;
        },
        activeTabData: async store => {
            let tab = await store.chrome.selectedTab();
            tab.wwurl = store.chrome.util.getName(tab.url, true);
            let blacklist = await store.blacklist.checkUrl(tab.url);
            return {
                tab,
                blacklist
            };
        }
    },
    mutations: {
        open: (state, value) => {
            state.chrome.open(value);
        }
    }
};