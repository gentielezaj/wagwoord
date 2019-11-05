export default function (service, store) {
    if (!store) store = {};
    if (!store.namespaced) {
        store.namespaced = true;
    }

    // #region state
    if (!store.state) {
        store.state = {
            service: new service()
        };
    } else if (!store.state.service) {
        store.state.service = new service();
    }
    // #endregion state

    // #region getters
    if (!store.getters)
        store.getters = {};

    if (!store.getters.item) {
        store.getters.item = state => async id => {
            let model = await state.service.getItem(id);
            return model;
        };
    }
    if (!store.getters.items) {
        store.getters.items = state => async query => {
            let model = await state.service.get(query);
            return model;
        };
    }
    if (!store.getters.list) {
        store.getters.list = state => async query => {
            let model = await state.service.list(query);
            return model;
        };
    }
    // #endregion getters

    // #region actions
    if (!store.actions) store.actions = {};
    if (!store.actions.save) {
        store.actions.save = async (context, value) => {
            try {
                const results = await context.state.service.save(value);
                context.commit('service');
                return results;
            } catch (error) {
                throw error;
            }
        };
    }
    if (!store.actions.sync) {
        store.actions.sync = async (context) => {
            try {
                const results = await context.state.service.sync();
                context.commit('service');
                return results;
            } catch (error) {
                throw error;
            }
        };
    }

    if (!store.actions.delete) {
        store.actions.delete = async (context, value) => {
            try {
                let results = value === 'all' ? await context.state.service.deleteAll() : await context.state.service.delete(value);
                context.commit('service');
                return results;
            } catch (error) {
                throw error;
            }
        };
    }
    // #endregion actions

    // #region mutations
    if (!store.mutations) {
        store.mutations = {
            service: (state) => {
                state.service = new service();
            }
        };
    } else if (!store.mutations.service) {
        store.mutations.service = (state) => {
            state.service = new service();
        };
    }
    // #endregion mutations

    return store;
}