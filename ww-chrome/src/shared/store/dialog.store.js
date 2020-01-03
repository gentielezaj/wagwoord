import deleteComponent from '../components/common/delete-dialog.component';

export default {
    namespaced: true,
    state: {
        options: {},
        id: 'ww-app-dialog'
    },
    getters: {
        isOpen: state => {
            return state.options.component ? true : false;
        },
        component: state => {
            return state.options.component;
        },
        options: state => {
            return state.options || {};
        },
        disableCloseFromOutside: state => {
            return state.options.disableClose;
        },
        id: state => {
            return state.id;
        },
        optionId: state => {
            return state.options.id || new Date().getTime();
        }
    },
    mutations: {
        close: (state, formOutside) => {
            if(formOutside && state.options.disableClose) return;
            state.options = {};
            document.getElementById(state.id).open = false;
        },
        open: (state, options) => {
            state.options = options;
            document.getElementById(state.id).open = true;
        },
        delete: (state, options) => {
            state.options = {
                component: deleteComponent,
                componentOptions: options
            };
            document.getElementById(state.id).open = true;
        }
    }
};