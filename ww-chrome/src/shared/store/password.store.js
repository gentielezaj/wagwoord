import PasswordSettingsService from "../services/passwords/password-settings.service";
import coreStore from './core.store';
import { ServiceProvider } from './service-provider';

const store = {
    namespaced: true,
    state: {
        settings: new ServiceProvider('passwordSettings')
    },
    getters: {
        settings: async state => await state.settings.request('getOrDefults')
    },
    actions: {
        settings: async (context, value) => {
            try {
                const results = await context.state.settings.request('save', [value]);
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
                const fileText = await context.state.util.getTextFromFile(file);
                return await context.state.service.request('readPasswordsFromFile', [{
                    name: file.name,
                    text: fileText,
                    type: file.type
                }]);
            } catch (error) {
                console.error(error);
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