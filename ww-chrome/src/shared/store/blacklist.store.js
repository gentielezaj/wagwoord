import core from './core.store.js';
import blacklistService from '../services/blacklist/blacklist.service';

const store = {
    actions: {
        toggle: async (context, value) => {
            try {
                return await context.state.service.toggle(value);
            } catch (error) {
                throw error;
            }
        }
    }
};

export default core(blacklistService, store);