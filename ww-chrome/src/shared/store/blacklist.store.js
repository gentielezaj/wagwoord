import core from './core.store.js';

const store = {
    actions: {
        toggle: async (context, value) => {
            try {
                return await context.state.service('toggle', [value]);
            } catch (error) {
                throw error;
            }
        }
    }
};

export default core('blacklist', store);