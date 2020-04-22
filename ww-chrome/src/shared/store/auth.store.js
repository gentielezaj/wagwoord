import { ServiceProvider } from './service-provider';

export default {
    namespaced: true,
    state: {
        syncing: false,
        provider: new ServiceProvider('auth')
    },
    getters: {
        checkProxy: async state => {
            return await state.provider.request('checkProxy');
        },
        loginData: async state => {
            return await state.provider.request('loginData');
        }
    },
    actions: {
        login: async (context, model) => {
            context.commit('syncing', true);
            var result = await context.state.provider.request('login', [model]);
            context.commit('syncing', false);
            return result;
        },
        checkProxy: async (context) => {
            context.commit('syncing', true);
            var result = await context.state.provider.request('checkProxy');
            context.commit('syncing', false);
            return result;
        }
    },
    mutations: {
        syncing: (state, value) => {
            state.syncing = value;
        },
        refresh: state => {
            state.service = new ServiceProvider();
        }
    }
};