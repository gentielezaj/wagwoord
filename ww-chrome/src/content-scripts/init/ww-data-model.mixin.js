export default {
    install: function (Vue, options) {
        const obj = {
            envirement: "debug",
            ...options
        };

        Object.freeze(obj);

        Vue.prototype.$appData = obj;
    }
};