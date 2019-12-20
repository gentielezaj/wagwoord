import core from './core.store.js';
import codegeneratorService from '../services/code-generator/code-generator.service';

const store = {
    getters: {
        assingeDefaults: state => item => {
            return state.service.assigneDefaultValues(item);
        }
    }
};

export default core(codegeneratorService, store);