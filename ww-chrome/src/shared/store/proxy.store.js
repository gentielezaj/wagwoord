import {
    ProxySettingsService
} from '../services/proxy.service';

export default {
    namespaced: true,
    state: {
        proxy: new ProxySettingsService()
    },
    getters: {
        model: async state => await state.proxy.get(),
        domain: async state => await state.proxy.get('domain'),
        headers: async state => await state.proxy.get('headers')
    },
    actions: {
        save: async (context, value) => {
            try {
                const results = await context.state.proxy.save(value);
                context.commit('refresh');
                return results;
            } catch (error) {
                throw error;
            }
        }
    },
    mutations: {
        refresh: (state) => {
            state.proxy = new ProxySettingsService();
        }
    }
};