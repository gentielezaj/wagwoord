import { WWUtil } from './ww-util';

export default {
    install: function (Vue, options) {
        const obj = {
            envirement: "debug",
            ...options
        };

        Object.freeze(obj);

        Vue.prototype.$constants = obj;
        Vue.prototype.$util = WWUtil;
    }
};