import ChromeService from '../services/chrome.service';
import { ServiceProvider } from './service-provider';

export default {
    namespaced: true,
    state: {
        chrome: new ChromeService(),
        service: new ServiceProvider()
    },
    getters: {
        selectedTab: async store => {
            let tab = await store.chrome.selectedTab();
            tab.wwurl = store.chrome.util.getName(tab.url, true);
            return tab;
        },
        activeTabData: async store => {
            let tab = await store.chrome.selectedTab();
            tab.wwurl = store.chrome.util.getName(tab.url, true);
            let blacklist = await store.service.request('checkUrl', [tab.url], 'blacklist');
            return {
                tab,
                blacklist
            };
        }
    },
    actions: {
        clear: async context => {
            await context.state.chrome.clear();
            return true;
        }
    },
    mutations: {
        open: (state, value) => {
            state.chrome.open(value);
        },
        refresh: state => {
            state.chrome = new ChromeService();
        }
    }
};