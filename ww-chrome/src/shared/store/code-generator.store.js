import core from './core.store.js';

const store = {
    getters: {
        assingeDefaults: state => (item, isForm) => {
            return state.service.request('assigneDefaultValues', [item, isForm]);
        }
    }
};

export default core('codeGenerator', store);