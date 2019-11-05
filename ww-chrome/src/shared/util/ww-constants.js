export default {
    install: function (Vue, options) {
        const obj = {
            envirement: "debug",
            scope: options.scope
        };

        Object.freeze(obj);

        Vue.prototype.$constants = obj;
    }
};