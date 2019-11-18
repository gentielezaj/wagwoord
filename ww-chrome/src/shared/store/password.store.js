import PasswordSettingsService from "../services/passwords/password-settings.service";
import PasswordService from "../services/passwords/password.service";
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
                return await context.state.service.generate(value.length, value.regex);
            } catch (error) {
                throw error;
            }
        },
        file: async (context, file) => {
            if (!file) return undefined;
            try {
                return await context.state.service.readPasswordsFromFile(file);
            } catch (error) {
                throw error;
            }
        },
        import: async (context, model) => {
            if (!model || !model.data) return undefined;
            context.commit('syncing', true);
            try {
                const val = await context.state.service.import(model.data, model.onSave);
                context.commit('syncing', false);
                return val;
            } catch (error) {
                context.commit('syncing', false);
                throw error;
            }
        },
        export: async(context, filters) => {
            try {
                return await context.state.service.export(filters);
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

export default coreStore(PasswordService, store);