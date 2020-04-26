import { ServiceProvider } from './service-provider';
import { WWUtil } from '../util/ww-util';

export default function(service, store) {
    store = store || {};
    return {
        namespaced: true,
        state: {
            ...store.state,
            service: typeof service == 'string' ? new ServiceProvider(service) : new service(),
            syncing: false,
            util: WWUtil
        },
        getters: {
            ...store.getters,
            item: state => async id => {
                let model = await state.service.getItem(id);
                return model;
            },
            items: state => async query => {
                let model = await state.service.get(query);
                return model;
            },
            list: state => async query => {
                let model = await state.service.list(query);
                return model;
            },
            syncing: state => {
                return state.syncing;
            }
        },
        actions: {
            ...store.actions,
            save: async (context, value) => {
                try {
                    context.commit('syncing', true);
                    const results = await context.state.service.save(value);
                    context.commit('service');
                    context.commit('syncing', false);
                    return results;
                } catch (error) {
                    context.commit('syncing', false);
                    throw error;
                }
            },
            sync: async (context) => {
                try {
                    context.commit('syncing', true);
                    const results = await context.state.service.sync();
                    context.commit('service');
                    context.commit('syncing', false);
                    return results;
                } catch (error) {
                    throw error;
                }
            },
            delete: async (context, value) => {
                try {
                    let results = value === 'all' ? await context.state.service.deleteAll() : await context.state.service.delete(value);
                    context.commit('service');
                    return results;
                } catch (error) {
                    throw error;
                }
            }
        },
        mutations: {
            ...store.mutations,
            service: (state) => {
                state.service = typeof service == 'string' ? new ServiceProvider(service) : new service();
            },
            syncing: (state, value) => {
                state.syncing = value;
            }
        }
    };
}