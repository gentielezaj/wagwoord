import PasswordSettingsService from "../services/passwords/password-settings.service";
import coreStore from './core.store';

const store = {
    namespaced: true,
    state: {
        settings: new PasswordSettingsService()
    },
    getters: {
        settings: async state => await state.settings.getOrDefults()
    },
    actions: {
        settings: async (context, value) => {
            try {
                const results = await context.state.settings.save(value);
                context.commit('settings');
                return results;
            } catch (error) {
                throw error;
            }
        },
        generate: async (context, value) => {
            try {
                value = value || {};
                return await context.state.service.request('generate', [value.length, value.regex]);
            } catch (error) {
                throw error;
            }
        },
        file: async (context, file) => {
            if (!file) return undefined;
            try {
                return await context.state.service.request('readPasswordsFromFile', [file]);
            } catch (error) {
                throw error;
            }
        },
        import: async (context, model) => {
            if (!model || !model.data) return undefined;
            context.commit('syncing', true);
            try {
                const val = await context.state.service.request('import', [model.data, model.onSave]);
                return val;
            } catch (error) {
                throw error;
            } finally {
                context.commit('syncing', false);
            }
        },
        export: async(context, filters) => {
            try {
                return await context.state.service.request('export', [filters]);
            } catch (error) {
                throw error;
            }
        }
    },
    mutations: {
        settings: (state) => {
            state.settings = new PasswordSettingsService();
        }
    }
};

export default coreStore('password', store);