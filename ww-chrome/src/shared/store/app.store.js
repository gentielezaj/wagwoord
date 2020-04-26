import { ServiceProvider } from './service-provider';

export default {
    namespaced: true,
    state: {
        syncing: false,
        provider: new ServiceProvider('app')
    },
    actions: {
        syncSettings: async (context, model) => {
            context.commit('syncing', true);
            var result = await context.state.provider.request('syncSettings', null, 'background');
            context.commit('syncing', false);
            return result;
        }
    },
    mutations: {
        syncing: (state, value) => {
            state.syncing = value;
        },
        refresh: state => {
            state.service = new ServiceProvider('app');
        }
    }
};