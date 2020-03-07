import UtilService from '../services/util.service.js';

export default {
    namespaced: true,
    state: {
        service: new UtilService(),
        syncing: false
    },
    getters: {
        encryptionKey: async state => {
            return await state.service.getEcryptionKey();
        },
        wizardData: async state => {
            return await state.service.wizardData();
        },
        checkProxy: async state => {
            return state.service.checkProxy();
        }
    },
    actions: {
        save: async (context, data) => {
            try {
                context.commit('syncing', true);
                const results = await context.state.service.save(data);
                context.commit('service');
                context.commit('syncing', false);
                return results;
            } catch (error) {
                context.commit('syncing', false);
                throw error;
            }
        }
    },
    mutations: {
        service: (state) => {
            state.service = new UtilService();
        },
        syncing: (state, value) => {
            state.syncing = value;
        }
    }
};